import { Collection } from '@discordjs/collection';
import { Client } from '../client';
import { Tab } from './tab';
import { TopicType } from './topic';

export class TabManager extends Collection<string, Tab> {
  constructor(readonly client: Client) {
    super();
  }

  async sendTopic(
    tabId: string,
    text: string,
    topicType: TopicType,
    downloadUrl?: string,
    anonym = false
  ): Promise<void> {
    await this.client.chat.sendCommand('NewTopic', {
      text,
      topicType,
      downloadUrl,
      anonym,
      ...this.createCommand(tabId),
    });
  }

  async subscribe(tabId: string): Promise<void> {
    await this.client.chat.sendCommand('SubscribeTabWithClick', this.createCommand(tabId));
  }

  /**
   * Request new topics when scrolling down.
   * Max every 130 ms
   */
  async scroll(tabId: string): Promise<void> {
    await this.client.chat.sendCommand(
      'SubscribeTabWithScrollDownwards',
      this.createCommand(tabId)
    );
  }

  async search(tabId: string, searchTerm: string): Promise<void> {
    await this.client.chat.sendCommand('SearchTabContent', {
      searchTerm,
      ...this.createCommand(tabId),
    });
  }

  private createCommand(tabId: string) {
    const scores = this.client.tabs.get(tabId)?.topics.map((topic) => topic.sortScore);
    const minScore = Math.min(...(scores ?? [-Infinity]));
    const maxScore = Math.max(...(scores ?? [Infinity]));

    return { tabId, minScore, maxScore, topicCount: scores?.length || 1 };
  }
}
