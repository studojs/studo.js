import EventEmitter from 'emittery';
import { customAlphabet } from 'nanoid';
import { Channel, ChannelManager, Tab } from './chat';
import { Message } from './chat/message';
import { MessageManager } from './chat/messageManager';
import { TabManager } from './chat/tabManager';
import { Topic } from './chat/topic';
import { TopicManager } from './chat/topicManager';
import { RestManager } from './rest/restManager';
import { ChatSocket } from './socket';

export const randomInstallationId = customAlphabet('0123456789abcdef', 20);

interface ClientEvents {
  channelUpdate: Channel;
  disconnect: undefined;
  messageUpdate: Message;
  pointsUpdate: number;
  ready: undefined;
  tabUpdate: Tab;
  topicUpdate: Topic;
}

export class Client extends EventEmitter<ClientEvents> {
  readonly installationId = randomInstallationId(); // Should be unique per installation, but doesn't matter
  readonly api = new RestManager(this);
  // readonly parser = new ParserSocket(this);
  readonly chat = new ChatSocket(this);
  readonly channels = new ChannelManager(this);
  readonly tabs = new TabManager(this);
  readonly topics = new TopicManager(this);
  readonly messages = new MessageManager(this);
  points = 0;

  constructor(readonly sessionToken: string) {
    super();

    this.chat.socket.on('disconnect', () => {
      this.emit('disconnect');
    });

    this.chat.on('UpdateSetting', (cmd) => {
      if (cmd.id === 'karma') {
        this.points = parseInt(cmd.value);
        this.emit('pointsUpdate', this.points);
      }
    });

    this.chat.on('UpdateChannels', ({ channels }) => {
      for (const rawChannel of channels) {
        const oldTabs = this.channels.get(rawChannel.id)?.tabs;
        const channel = new Channel(this, rawChannel, oldTabs);
        this.channels.set(channel.id, channel);
        this.emit('channelUpdate', channel);
      }
    });

    this.chat.on('UpdateTabs', ({ tabs }) => {
      for (const rawTab of tabs) {
        const oldTopics = this.tabs.get(rawTab.id)?.topics;
        const tab = new Tab(this, rawTab, oldTopics);
        tab.channel?.tabs.set(tab.id, tab);
        this.tabs.set(tab.id, tab);
        this.emit('tabUpdate', tab);
      }
    });

    this.chat.on('UpdateTopics', ({ topics }) => {
      for (const rawTopic of topics) {
        const oldMessages = this.topics.get(rawTopic.id)?.messages;
        const topic = new Topic(this, rawTopic, oldMessages);
        topic.tab?.topics.set(topic.id, topic);
        this.topics.set(topic.id, topic);
        this.emit('topicUpdate', topic);
      }
    });

    this.chat.on('UpdateMessages', ({ messages }) => {
      for (const rawMsg of messages) {
        const msg = new Message(this, rawMsg);
        msg.topic?.messages.set(msg.id, msg);
        this.messages.set(msg.id, msg);
        this.emit('messageUpdate', msg);
      }
    });
  }

  get connected(): boolean {
    return this.chat.socket.connected;
  }

  async connect(): Promise<void> {
    if (this.connected) return;
    await this.chat.connect();
    await this.chat.register();
    // await this.parser.connect();
    // await this.parser.register();
    // await this.parser.sync();
    this.emit('ready');
  }

  disconnect(): void {
    this.chat.disconnect();
    // this.parser.disconnect();
  }
}
