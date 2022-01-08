import EventEmitter from 'emittery';
import { customAlphabet } from 'nanoid';
import {
  Cache,
  Channel,
  ChatAction,
  ChatTag,
  Message,
  Tab,
  Topic,
  TopicTypeDescriptor,
  UpdateSetting,
} from './chat';
import { RestManager } from './rest/restManager';
import { ChatSocket } from './socket';

export const randomInstallationId = customAlphabet('0123456789abcdef', 20);

interface ClientEvents {
  channelUpdate: Channel;
  chatAction: ChatAction;
  chatTag: ChatTag;
  disconnect: undefined;
  messageUpdate: Message;
  pointsUpdate: number;
  ready: undefined;
  settingsUpdate: UpdateSetting;
  tabUpdate: Tab;
  topicTypeDescriptor: TopicTypeDescriptor;
  topicUpdate: Topic;
}

export class Client extends EventEmitter<ClientEvents> {
  installationId = randomInstallationId(); // Should be unique per installation, but doesn't matter
  api = new RestManager(this);
  // parser = new ParserSocket(this);
  chat = new ChatSocket(this);
  cache = new Cache();
  points = 0;

  constructor(public sessionToken: string) {
    super();

    this.chat.socket.on('disconnect', () => {
      this.emit('disconnect');
    });

    this.chat.on('SendChatActions', ({ clientChatActions }) => {
      for (const action of clientChatActions) {
        this.cache.chatActions.set(action.id, action);
        this.emit('chatAction', action);
      }
    });

    this.chat.on('SendChatTags', ({ clientChatTags }) => {
      for (const tag of clientChatTags) {
        // Ignore the 200+ organisations
        if (tag.id.startsWith('VERIFIED_BY_ORGANIZATION_')) continue;
        this.cache.chatTags.set(tag.id, tag);
        this.emit('chatTag', tag);
      }
    });

    this.chat.on('SendTopicTypeDescriptors', ({ descriptors }) => {
      for (const descriptor of descriptors) {
        this.cache.topicTypeDescriptors.set(descriptor.id, descriptor);
        this.emit('topicTypeDescriptor', descriptor);
      }
    });

    this.chat.on('UpdateSetting', (cmd) => {
      this.cache.settings.set(cmd.id, cmd.value);
      this.emit('settingsUpdate', cmd);
      if (cmd.id === 'karma') {
        this.points = Number(cmd.value);
        this.emit('pointsUpdate', this.points);
      }
    });

    this.chat.on('UpdateChannels', ({ channels }) => {
      for (const rawChannel of channels) {
        const oldTabs = this.cache.channels.get(rawChannel.id)?.tabs;
        const channel = new Channel(this, rawChannel, oldTabs);
        this.cache.channels.set(channel.id, channel);
        this.emit('channelUpdate', channel);
      }
      this.chat.sortChannels();
    });

    this.chat.on('UpdateTabs', ({ tabs }) => {
      for (const rawTab of tabs) {
        const oldTopics = this.cache.tabs.get(rawTab.id)?.topics;
        const tab = new Tab(this, rawTab, oldTopics);
        tab.channel?.tabs.set(tab.id, tab);
        this.cache.tabs.set(tab.id, tab);
        this.emit('tabUpdate', tab);
      }
      this.chat.sortTabs();
    });

    this.chat.on('UpdateTopics', ({ topics }) => {
      for (const rawTopic of topics) {
        const oldMessages = this.cache.topics.get(rawTopic.id)?.messages;
        const topic = new Topic(this, rawTopic, oldMessages);
        topic.tab?.topics.set(topic.id, topic);
        this.cache.topics.set(topic.id, topic);
        this.emit('topicUpdate', topic);
      }
      this.chat.sortTopics();
    });

    this.chat.on('UpdateMessages', ({ messages }) => {
      for (const rawMsg of messages) {
        const msg = new Message(this, rawMsg);
        msg.topic?.messages.set(msg.id, msg);
        this.cache.messages.set(msg.id, msg);
        this.emit('messageUpdate', msg);
      }
      this.chat.sortMessages();
    });
  }

  get connected(): boolean {
    return this.chat.socket.connected;
  }

  async connect(): Promise<void> {
    if (this.connected) return;
    await this.chat.connect();
    // await this.parser.connect();
    // await this.parser.sync();
    this.emit('ready');
  }

  disconnect(): void {
    this.chat.disconnect();
    // this.parser.disconnect();
  }
}
