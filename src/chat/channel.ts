import { Collection } from '@discordjs/collection';
import { Client } from '../client';
import { parseRawIds } from '../utils';
import { Tab } from './tab';

/**
 * Raw channel data received from the socket.io server
 */
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

interface ActionParameters {
  SHARE: string;
}

type ChannelType = 'city' | 'course' | 'global' | 'private' | 'study' | 'uiframe' | 'uni';

export class Channel {
  readonly id: string;
  readonly name: string;
  readonly uniId: string;
  readonly sortScore: number;
  readonly toolbarTitle: string;
  readonly footer: string;
  readonly iconChar: string;
  readonly pinned: boolean;
  readonly hidden: boolean;
  readonly shareText: string;
  readonly shareUrl: string;
  readonly actionIds: string[];
  readonly actionParameters: ActionParameters;

  constructor(
    readonly client: Client,
    data: RawChannel,
    public tabs = new Collection<string, Tab>()
  ) {
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
    await this.client.channels.subscribe(this.id);
  }

  async sendActions(...actions: string[]): Promise<void> {
    await this.client.channels.sendActions(this.id, ...actions);
  }
}
