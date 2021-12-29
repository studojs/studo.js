import { Client } from '../client';
import { Collection, parseRawIds } from '../utils';
import { Tab } from './tab';

export interface RawChannel {
  id: string;
  name: string;
  uniId: string;
  sortScore: number;
  toolbarTitle: string;
  footer: string;
  iconChar: string;
  pinned: boolean;
  hidden: boolean;
  shareText: string;
  shareUrl: string;
  allowedActionIdsRaw: string;
  actionParametersRaw: string;
}

type ChannelType = 'city' | 'course' | 'global' | 'private' | 'study' | 'uiframe' | 'uni';

export class Channel {
  id: string;
  name: string;
  uniId: string;
  sortScore: number;
  toolbarTitle: string;
  footer: string;
  iconChar: string;
  pinned: boolean;
  hidden: boolean;
  shareText: string;
  shareUrl: string;
  actionIds: string[];
  actionParameters: Record<string, string>;

  constructor(public client: Client, data: RawChannel, public tabs = new Collection<Tab>()) {
    this.id = data.id;
    this.name = data.name;
    this.uniId = data.uniId;
    this.sortScore = data.sortScore;
    this.toolbarTitle = data.toolbarTitle;
    this.footer = data.footer;
    this.iconChar = data.iconChar;
    this.pinned = data.pinned;
    this.hidden = data.hidden;
    this.shareText = data.shareText;
    this.shareUrl = data.shareUrl;
    this.actionIds = parseRawIds(data.allowedActionIdsRaw);
    this.actionParameters = JSON.parse(data.actionParametersRaw);
  }

  get type(): ChannelType {
    return this.id.split('_')[0] as ChannelType;
  }

  async subscribe(): Promise<void> {
    await this.client.chat.subscribeChannel(this.id);
  }

  async sendActions(...actions: string[]): Promise<void> {
    await this.client.chat.sendChannelActions(this.id, ...actions);
  }
}
