import { Collection } from '@discordjs/collection';
import { Client } from '../client';
import { Topic } from './topic';
import { VoteType } from './types';

export class TopicManager extends Collection<string, Topic> {
  constructor(readonly client: Client) {
    super();
  }

  async sendMessage(
    topicId: string,
    text: string,
    downloadUrl?: string,
    anonym = false
  ): Promise<void> {
    await this.client.chat.sendCommand('NewMessage', {
      text,
      downloadUrl,
      anonym,
      ...this.createCommand(topicId),
    });
  }

  async subscribe(topicId: string): Promise<void> {
    await this.client.chat.sendCommand('SubscribeTopicWithClick', this.createCommand(topicId));
  }

  /**
   * Request new messages when scrolling down.
   * Max every 130 ms
   */
  async scroll(topicId: string): Promise<void> {
    await this.client.chat.sendCommand(
      'SubscribeTopicWithScrollDownwards',
      this.createCommand(topicId)
    );
  }

  async vote(topicId: string, type: VoteType): Promise<void> {
    await this.client.chat.sendCommand('VoteTopic', {
      voteType: type,
      ...this.createCommand(topicId),
    });
  }

  async sendActions(topicId: string, ...actions: string[]): Promise<void> {
    await this.client.chat.sendCommand('TopicUserAction', {
      actionChain: actions,
      parameters: {},
      ...this.createCommand(topicId),
    });
  }

  private createCommand(topicId: string) {
    const scores = this.client.topics.get(topicId)?.messages.map((msg) => msg.sortScore);
    const minScore = Math.min(...(scores ?? [-Infinity]));
    const maxScore = Math.max(...(scores ?? [Infinity]));

    return { topicId, minScore, maxScore, messageCount: scores?.length || 1 };
  }
}
