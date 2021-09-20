import { Collection } from '@discordjs/collection';
import { Client } from '../client';
import { Message } from './message';
import { VoteType } from './types';

export class MessageManager extends Collection<string, Message> {
  constructor(readonly client: Client) {
    super();
  }

  async edit(messageId: string, newText: string, anonym = false): Promise<void> {
    await this.client.chat.sendCommand('EditMessage', { newText, messageId, anonym });
  }

  async vote(messageId: string, type: VoteType): Promise<void> {
    await this.client.chat.sendCommand('VoteMessage', { messageId, voteType: type });
  }

  async sendActions(messageId: string, ...actions: string[]): Promise<void> {
    await this.client.chat.sendCommand('MessageUserAction', {
      messageId,
      actionChain: actions,
      parameters: {},
    });
  }
}
