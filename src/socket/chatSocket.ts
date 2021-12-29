import {
  ClientCommand,
  ClientCommands,
  DecodedServerCommand,
  ServerCommands,
  VoteType,
} from '../chat';
import { Client } from '../client';
import { decode, encode } from '../utils';
import { SocketManager } from './socketManager';

// Static collator for comparing strings
const collator = new Intl.Collator();

export class ChatSocket extends SocketManager<ServerCommands> {
  constructor(client: Client) {
    super(client, 'https://chat.studo.co');

    // Parse incoming commands
    this.socket.on('command', async (msg: string) => {
      const { commands }: { commands: DecodedServerCommand[] } = await decode(msg);
      for (const cmd of commands) {
        const content = JSON.parse(cmd.content);
        this.emit(cmd.className, content);
      }
    });
  }

  async sendCommand<Name extends keyof ClientCommands>(
    name: Name,
    content: ClientCommands[Name]
  ): Promise<any> {
    const encodedContent = await encode({
      ...content,
      lastClientActionId: 0,
      commandId: Date.now().toString(),
      waitForAck: false,
    } as ClientCommand);
    return await this.send('command', { className: name, content: encodedContent });
  }

  // Channel methods
  async subscribeChannel(channelId: string): Promise<void> {
    await this.sendCommand('SubscribeChannel', { channelId });
  }

  async sendChannelActions(channelId: string, ...actions: string[]): Promise<void> {
    await this.sendCommand('ChannelUserAction', {
      channelId,
      actionChain: actions,
    });
  }

  /**
   * Sort channels based on their score, then name (for private channels)
   */
  sortChannels() {
    this.client.cache.channels = this.client.cache.channels
      .clone()
      .sort((a, b) => b.sortScore - a.sortScore || collator.compare(a.name, b.name));
  }

  // Tab methods
  async subscribeTab(tabId: string): Promise<void> {
    await this.sendCommand('SubscribeTabWithClick', this.createTabCommand(tabId));
  }

  /**
   * Load new topics when scrolling down.
   * 130 ms ratelimited
   */
  async scrollTab(tabId: string): Promise<void> {
    await this.sendCommand('SubscribeTabWithScrollDownwards', this.createTabCommand(tabId));
  }

  /**
   * Search for topics or messages in a tab.
   * Messages can be accessed from
   * ```js
   * client.cache.messages.filter(m => m.topicId === 'searchTopic')
   * ```
   */
  async searchTab(tabId: string, searchTerm: string): Promise<void> {
    await this.sendCommand('SearchTabContent', {
      searchTerm,
      ...this.createTabCommand(tabId),
    });
  }

  /**
   * Sort tabs based on their score
   */
  sortTabs() {
    this.client.cache.tabs = this.client.cache.tabs
      .clone()
      .sort((a, b) => b.sortScore - a.sortScore);
  }

  // Topic methods
  /**
   * Send a new topic in a tab
   */
  async sendTopic(
    tabId: string,
    text: string,
    topicType: string,
    downloadUrl?: string,
    anonym = false
  ): Promise<void> {
    await this.sendCommand('NewTopic', {
      text,
      topicType,
      downloadUrl,
      anonym,
      ...this.createTabCommand(tabId),
    });
  }

  async subscribeTopic(topicId: string): Promise<void> {
    await this.sendCommand('SubscribeTopicWithClick', this.createTopicCommand(topicId));
  }

  /**
   * Load new messages when scrolling down.
   * 130 ms ratelimited
   */
  async scrollTopic(topicId: string): Promise<void> {
    await this.sendCommand('SubscribeTopicWithScrollDownwards', this.createTopicCommand(topicId));
  }

  async voteTopic(topicId: string, type: VoteType): Promise<void> {
    await this.sendCommand('VoteTopic', {
      voteType: type,
      ...this.createTopicCommand(topicId),
    });
  }

  async sendTopicActions(topicId: string, ...actions: string[]): Promise<void> {
    await this.sendCommand('TopicUserAction', {
      actionChain: actions,
      parameters: {},
      ...this.createTopicCommand(topicId),
    });
  }

  /**
   * Sort topics based on their score
   */
  sortTopics() {
    this.client.cache.topics = this.client.cache.topics
      .clone()
      .sort((a, b) => b.sortScore - a.sortScore);
  }

  // Message methods
  /**
   * Send a new message in a topic
   */
  async sendMessage(
    topicId: string,
    text: string,
    downloadUrl?: string,
    anonym = false
  ): Promise<void> {
    await this.sendCommand('NewMessage', {
      text,
      downloadUrl,
      anonym,
      ...this.createTopicCommand(topicId),
    });
  }

  async editMessage(messageId: string, newText: string, anonym = false): Promise<void> {
    await this.sendCommand('EditMessage', { newText, messageId, anonym });
  }

  async voteMessage(messageId: string, type: VoteType): Promise<void> {
    await this.sendCommand('VoteMessage', { messageId, voteType: type });
  }

  async sendMessageActions(messageId: string, ...actions: string[]): Promise<void> {
    await this.sendCommand('MessageUserAction', {
      messageId,
      actionChain: actions,
      parameters: {},
    });
  }

  /**
   * Sort messages based on their score
   */
  sortMessages() {
    this.client.cache.messages = this.client.cache.messages
      .clone()
      .sort((a, b) => b.sortScore - a.sortScore);
  }

  private createTabCommand(tabId: string) {
    const scores = this.client.cache.tabs.get(tabId)?.topics.map((topic) => topic.sortScore);
    const minScore = Math.min(...(scores ?? [-Infinity]));
    const maxScore = Math.max(...(scores ?? [Infinity]));

    return { tabId, minScore, maxScore, topicCount: scores?.length || 1 };
  }

  private createTopicCommand(topicId: string) {
    const scores = this.client.cache.topics.get(topicId)?.messages.map((msg) => msg.sortScore);
    const minScore = Math.min(...(scores ?? [-Infinity]));
    const maxScore = Math.max(...(scores ?? [Infinity]));

    return { topicId, minScore, maxScore, messageCount: scores?.length || 1 };
  }
}
