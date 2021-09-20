import { Client } from '../client';
import { parseRawIds } from '../utils/index';
import { Channel } from './channel';
import { Tab } from './tab';
import { ChatPayloadStyle, ToolbarAction, VoteType, VotingType } from './types';

export interface RawTopic {
  id: string;
  tabId: string;
  channelId: string;
  header: string;
  footer: string;
  text: string;
  toolbarTitle: string;
  votes: number;
  hidden: boolean;
  sortScore: number;
  stickyInfo: string;
  notificationEnabled: boolean;
  enableFileUpload: boolean;
  scrollToBottomOnOpen: boolean;
  allowNewMessages: boolean;
  showNotificationToggleButton: boolean;
  canSubscribe: boolean;
  actionsEnabled: boolean;
  toolbarActionRaw: ToolbarAction;
  votingTypeRaw: VotingType;
  allowedActionIdsRaw: string;
  shareText: string;
  actionParametersRaw: string;
  typeRaw: TopicType;
  voteStateRaw: VoteType;
  styleRaw: ChatPayloadStyle;
  allowedInlineActionIdsRaw: string;
  tagIdsRaw: string;
  messageDelimiterRaw: MessageDelimiter;
  atMentionUsernamesRaw: string;
}

export type TopicType =
  | 'ELABORATION'
  | 'EXAM'
  | 'GENERAL'
  | 'GROUP_SEARCH'
  | 'LECTURE_NOTES'
  | 'NEWS'
  | 'OFFER'
  | 'QUESTION'
  | 'SUMMARY'
  | 'SEARCH'
  | 'TIPS';

type MessageDelimiter = 'FIRST' | 'ALL' | 'NONE';

export class Topic {
  readonly id: string;
  readonly tabId: string;
  readonly channelId: string;
  readonly header: string;
  readonly footer: string;
  readonly text: string;
  readonly toolbarTitle: string;
  readonly votes: number;
  readonly hidden: boolean;
  readonly sortScore: number;
  readonly stickyInfo: string;
  readonly notificationEnabled: boolean;
  readonly enableFileUpload: boolean;
  readonly scrollToBottomOnOpen: boolean;
  readonly allowNewMessages: boolean;
  readonly showNotificationToggleButton: boolean;
  readonly canSubscribe: boolean;
  readonly actionsEnabled: boolean;
  readonly toolbarAction: ToolbarAction;
  readonly votingType: VotingType;
  readonly actionIds: string[];
  readonly shareText: string;
  readonly actionParameters: Record<string, string>;
  readonly type: TopicType;
  readonly voteState: VoteType;
  readonly style: ChatPayloadStyle;
  readonly inlineActionIds: string[];
  readonly tagIds: string[];
  readonly messageDelimiter: MessageDelimiter;
  /**
   * username->url
   */
  readonly users: Record<string, string>;
  readonly authorName: string | undefined;
  readonly authorPoints: number | undefined;
  readonly fromYou: boolean;
  readonly replyCount: number;
  readonly views: number;
  readonly fileCount: number;

  constructor(
    readonly client: Client,
    data: RawTopic,
    public messages = client.messages.filter((message) => message.topicId === this.id)
  ) {
    this.id = data.id;
    this.tabId = data.tabId;
    this.channelId = data.channelId;
    this.header = data.header;
    this.footer = data.footer;
    this.text = data.text;
    this.toolbarTitle = data.toolbarTitle;
    this.votes = data.votes;
    this.hidden = data.hidden;
    this.sortScore = data.sortScore;
    this.stickyInfo = data.stickyInfo;
    this.notificationEnabled = data.notificationEnabled;
    this.enableFileUpload = data.enableFileUpload;
    this.scrollToBottomOnOpen = data.scrollToBottomOnOpen;
    this.allowNewMessages = data.allowNewMessages;
    this.showNotificationToggleButton = data.showNotificationToggleButton;
    this.canSubscribe = data.canSubscribe;
    this.actionsEnabled = data.actionsEnabled;
    this.toolbarAction = data.toolbarActionRaw;
    this.votingType = data.votingTypeRaw;
    this.actionIds = parseRawIds(data.allowedActionIdsRaw);
    this.shareText = data.shareText;
    this.actionParameters = JSON.parse(data.actionParametersRaw);
    this.type = data.typeRaw;
    this.voteState = data.voteStateRaw;
    this.style = data.styleRaw;
    this.inlineActionIds = parseRawIds(data.allowedInlineActionIdsRaw);
    this.tagIds = parseRawIds(data.tagIdsRaw);
    this.messageDelimiter = data.messageDelimiterRaw;

    this.users = JSON.parse(data.atMentionUsernamesRaw);
    this.fromYou = this.header.includes('(👤)');
    this.authorName = this.header.match(/([a-z\d_.]+) \(/)?.[1];
    const pointsMatch = this.header.match(/\((\d+)\)/);
    this.authorPoints = pointsMatch ? parseInt(pointsMatch[1]) : undefined;
    this.replyCount = parseInt(this.footer.match(/^\d+/)?.[0] || '0');
    this.fileCount = parseInt(this.footer.match(/(\d+) 📎/)?.[1] || '0');
    this.views = parseInt(this.footer.match(/, (\d+)/)?.[1] || '0');
  }

  async sendMessage(text: string, downloadUrl?: string): Promise<void> {
    await this.client.topics.sendMessage(this.id, text, downloadUrl);
  }

  async vote(type: VoteType): Promise<void> {
    await this.client.topics.vote(this.id, type);
  }

  /**
   * Request new messages when scrolling down
   */
  async scroll(): Promise<void> {
    await this.client.topics.scroll(this.id);
  }

  get channel(): Channel | undefined {
    return this.client.channels.get(this.channelId);
  }

  get tab(): Tab | undefined {
    return this.client.tabs.get(this.tabId);
  }

  async subscribe(): Promise<void> {
    await this.client.topics.subscribe(this.id);
  }

  async sendActions(...actions: string[]): Promise<void> {
    await this.client.topics.sendActions(this.id, ...actions);
  }
}
