import { Client } from '../client';
import { Collection } from '../utils';
import { parseRawIds } from '../utils/index';
import { Channel } from './channel';
import { Message } from './message';
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
  typeRaw: string;
  voteStateRaw: VoteType;
  styleRaw: ChatPayloadStyle;
  allowedInlineActionIdsRaw: string;
  tagIdsRaw: string;
  messageDelimiterRaw: MessageDelimiter;
  atMentionUsernamesRaw: string;
}

type MessageDelimiter = 'FIRST' | 'ALL' | 'NONE';

export class Topic {
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
  toolbarAction: ToolbarAction;
  votingType: VotingType;
  actionIds: string[];
  shareText: string;
  actionParameters: Record<string, string>;
  type: string;
  voteState: VoteType;
  style: ChatPayloadStyle;
  inlineActionIds: string[];
  tagIds: string[];
  messageDelimiter: MessageDelimiter;
  /**
   * username->url
   */
  users: Record<string, string>;
  authorName: string | undefined;
  authorPoints: number | undefined;
  fromYou: boolean;
  replyCount: number;
  views: number;
  fileCount: number;

  constructor(public client: Client, data: RawTopic, public messages = new Collection<Message>()) {
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
    this.authorPoints = pointsMatch ? Number(pointsMatch[1]) : undefined;
    this.replyCount = Number(this.footer.match(/^\d+/)?.[0] || '0');
    this.fileCount = Number(this.footer.match(/(\d+) 📎/)?.[1] || '0');
    this.views = Number(this.footer.match(/, (\d+)/)?.[1] || '0');
  }

  get channel(): Channel | undefined {
    return this.client.cache.channels.get(this.channelId);
  }

  get tab(): Tab | undefined {
    return this.client.cache.tabs.get(this.tabId);
  }

  async sendMessage(text: string, downloadUrl?: string, anonym = false): Promise<void> {
    await this.client.chat.sendMessage(this.id, text, downloadUrl, anonym);
  }

  async vote(type: VoteType): Promise<void> {
    await this.client.chat.voteTopic(this.id, type);
  }

  /**
   * Load new messages when scrolling down
   */
  async scroll(): Promise<void> {
    await this.client.chat.scrollTopic(this.id);
  }

  async subscribe(): Promise<void> {
    await this.client.chat.subscribeTopic(this.id);
  }

  async sendActions(...actions: string[]): Promise<void> {
    await this.client.chat.sendTopicActions(this.id, ...actions);
  }
}
