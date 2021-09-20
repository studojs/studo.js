import { Collection } from '@discordjs/collection';
import { Client } from '../client';
import { Channel } from './channel';

export class ChannelManager extends Collection<string, Channel> {
  constructor(readonly client: Client) {
    super();
  }

  async subscribe(channelId: string): Promise<void> {
    await this.client.chat.sendCommand('SubscribeChannel', { channelId });
  }

  async sendActions(channelId: string, ...actions: string[]): Promise<void> {
    await this.client.chat.sendCommand('ChannelUserAction', {
      channelId,
      actionChain: actions,
    });
  }
}
