import { Client } from '../client';
import { parseRawIds } from '../utils';
import { Channel } from './channel';
import { Tab } from './tab';
import { Topic } from './topic';
import { ChatPayloadStyle, VoteType } from './types';

export interface RawMessage {
  id: string;
  topicId: string;
  header: string;
  footer: string;
  text: string;
  htmlText: boolean;
  downloadUrl: string;
  fileName: string;
  url: string;
  votes: number;
  hidden: boolean;
  searchTerm: string;
  sortScore: number;
  actionsEnabled: boolean;
  inlineImageUrl: string;
  inlineImageScale: number;
  inlineImageMaxWidth: number;
  showAttachmentLayout: boolean;
  allowedActionIdsRaw: string;
  shareText: string;
  actionParametersRaw: string;
  voteStateRaw: VoteType;
  styleRaw: ChatPayloadStyle;
  allowedInlineActionIdsRaw: string;
  tagIdsRaw: string;
}

export class Message {
  readonly id: string;
  readonly topicId: string;
  readonly header: string;
  readonly footer: string;
  readonly text: string;
  readonly htmlText: boolean;
  readonly downloadUrl: string;
  readonly fileName: string;
  readonly url: string;
  readonly votes: number;
  readonly hidden: boolean;
  readonly searchTerm: string;
  readonly sortScore: number;
  readonly actionsEnabled: boolean;
  readonly inlineImageUrl: string;
  readonly inlineImageScale: number;
  readonly inlineImageMaxWidth: number;
  readonly showAttachmentLayout: boolean;
  readonly actionIds: string[];
  readonly shareText: string;
  readonly actionParameters: Record<string, string>;
  readonly voteState: VoteType;
  readonly style: ChatPayloadStyle;
  readonly inlineActionIds: string[];
  readonly tagIds: string[];
  readonly authorName: string | undefined;
  readonly authorPoints: number | undefined;
  readonly fromYou: boolean;

  constructor(readonly client: Client, data: RawMessage) {
    this.id = data.id;
    this.topicId = data.topicId;
    this.header = data.header;
    this.footer = data.footer;
    this.text = data.text;
    this.htmlText = data.htmlText;
    this.downloadUrl = data.downloadUrl;
    this.fileName = data.fileName;
    this.url = data.url;
    this.votes = data.votes;
    this.hidden = data.hidden;
    this.searchTerm = data.searchTerm;
    this.sortScore = data.sortScore;
    this.actionsEnabled = data.actionsEnabled;
    this.inlineImageUrl = data.inlineImageUrl;
    this.inlineImageScale = data.inlineImageScale;
    this.inlineImageMaxWidth = data.inlineImageMaxWidth;
    this.showAttachmentLayout = data.showAttachmentLayout;
    this.actionIds = parseRawIds(data.allowedActionIdsRaw);
    this.shareText = data.shareText;
    this.actionParameters = JSON.parse(data.actionParametersRaw);
    this.voteState = data.voteStateRaw;
    this.style = data.styleRaw;
    this.inlineActionIds = parseRawIds(data.allowedInlineActionIdsRaw);
    this.tagIds = parseRawIds(data.tagIdsRaw);

    this.fromYou = this.header.includes('(👤)');
    this.authorName = this.header.split(' ')[0] || undefined;
    const pointsMatch = this.header.match(/\((\d+)\)/);
    this.authorPoints = pointsMatch ? parseInt(pointsMatch[1]) : undefined;
  }

  get channel(): Channel | undefined {
    return this.topic?.channel;
  }

  get tab(): Tab | undefined {
    return this.topic?.tab;
  }

  get topic(): Topic | undefined {
    return this.client.topics.get(this.topicId);
  }

  async edit(text: string, anonym = false): Promise<void> {
    await this.client.messages.edit(this.id, text, anonym);
  }

  async vote(type: VoteType): Promise<void> {
    await this.client.messages.vote(this.id, type);
  }

  async sendActions(...actions: string[]): Promise<void> {
    await this.client.messages.sendActions(this.id, ...actions);
  }
}
