import { Client } from '../client';
import { parseRawIds } from '../utils';
import { Channel } from './channel';
import { TopicType } from './topic';
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
  defaultTopicTypeRaw: TopicType;
  privacyTypeRaw: PrivacyType;
}

/**
 * Tab in a channel.
 * Typically discussion or wiki.
 */
export class Tab {
  readonly id: string;
  readonly channelId: string;
  readonly title: string;
  readonly defaultTopicId: string;
  readonly sortScore: number;
  readonly hidden: boolean;
  readonly notificationEnabled: boolean;
  readonly enableNewTopics: boolean;
  readonly enableFileUpload: boolean;
  readonly stickyInfo: string;
  readonly shareUrl: string;
  readonly votingType: VotingType;
  readonly toolbarAction: ToolbarAction;
  readonly allowedTopicTypes: TopicType[];
  readonly defaultTopicType: TopicType;
  readonly privacyType: PrivacyType;

  constructor(
    readonly client: Client,
    data: RawTab,
    public topics = client.topics.filter((topic) => topic.tabId === this.id)
  ) {
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
    return this.client.channels.get(this.channelId);
  }

  async sendTopic(
    text: string,
    topicType = this.defaultTopicType,
    downloadUrl?: string
  ): Promise<void> {
    await this.client.tabs.sendTopic(this.id, text, topicType, downloadUrl);
  }

  async subscribe(): Promise<void> {
    await this.client.tabs.subscribe(this.id);
  }

  /**
   * Request new topics when scrolling down
   */
  async scroll(): Promise<void> {
    await this.client.tabs.scroll(this.id);
  }

  async search(searchTerm: string): Promise<void> {
    await this.client.tabs.search(this.id, searchTerm);
  }
}
