import { Client } from '../client';
import { Collection, parseRawIds } from '../utils';
import { Channel } from './channel';
import { NewTopicOptions } from './command';
import { Topic } from './topic';
import { PrivacyType, ToolbarAction, VotingType } from './types';

export interface RawTab {
  id: string;
  channelId: string;
  title: string;
  defaultTopicId: string;
  sortScore: number;
  hidden: boolean;
  notificationEnabled: boolean;
  enableNewTopics: boolean;
  enableFileUpload: boolean;
  stickyInfo: string;
  shareUrl: string;
  votingTypeRaw: VotingType;
  toolbarActionRaw: ToolbarAction;
  allowedTopicTypesRaw: string;
  defaultTopicTypeRaw: string;
  privacyTypeRaw: PrivacyType;
}

/**
 * Tab in a channel.
 * Typically discussion or wiki.
 */
export class Tab {
  id: string;
  channelId: string;
  title: string;
  defaultTopicId: string;
  sortScore: number;
  hidden: boolean;
  notificationEnabled: boolean;
  enableNewTopics: boolean;
  enableFileUpload: boolean;
  stickyInfo: string;
  shareUrl: string;
  votingType: VotingType;
  toolbarAction: ToolbarAction;
  allowedTopicTypes: string[];
  defaultTopicType: string;
  privacyType: PrivacyType;

  constructor(public client: Client, data: RawTab, public topics = new Collection<Topic>()) {
    this.id = data.id;
    this.channelId = data.channelId;
    this.title = data.title;
    this.defaultTopicId = data.defaultTopicId;
    this.sortScore = data.sortScore;
    this.hidden = data.hidden;
    this.notificationEnabled = data.notificationEnabled;
    this.enableNewTopics = data.enableNewTopics;
    this.enableFileUpload = data.enableFileUpload;
    this.stickyInfo = data.stickyInfo;
    this.shareUrl = data.shareUrl;
    this.votingType = data.votingTypeRaw;
    this.toolbarAction = data.toolbarActionRaw;
    this.allowedTopicTypes = parseRawIds(data.allowedTopicTypesRaw);
    this.defaultTopicType = data.defaultTopicTypeRaw;
    this.privacyType = data.privacyTypeRaw;
  }

  get channel(): Channel | undefined {
    return this.client.cache.channels.get(this.channelId);
  }

  async sendTopic(options: NewTopicOptions): Promise<void> {
    await this.client.chat.sendTopic(this.id, options);
  }

  async subscribe(): Promise<void> {
    await this.client.chat.subscribeTab(this.id);
  }

  /**
   * Load new topics when scrolling down
   */
  async scroll(): Promise<void> {
    await this.client.chat.scrollTab(this.id);
  }

  async search(searchTerm: string): Promise<void> {
    await this.client.chat.searchTab(this.id, searchTerm);
  }
}
