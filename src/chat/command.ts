import { RawChannel } from './channel';
import { RawMessage } from './message';
import { RawTab } from './tab';
import { RawTopic } from './topic';
import { VoteType } from './types';

export interface DecodedServerCommand {
  className: keyof ServerCommands;
  content: string;
}
export interface Command {
  commandId: string; // 32 byte random hex
  waitForAck: boolean;
  lastClientActionId: number;
}
export type ClientCommand = Command;
export interface ServerCommand extends Command {
  triggerClientCommandId: string | null;
}

export interface ChannelCommand extends ClientCommand {
  channelId: string;
}
export interface TabCommand extends ClientCommand {
  maxScore: number;
  minScore: number;
  tabId: string;
  topicCount: number;
}
export interface TopicCommand extends ClientCommand {
  maxScore: number;
  minScore: number;
  topicId: string;
  messageCount: number;
}
export interface MessageCommand extends ClientCommand {
  messageId: string;
}

export interface ChannelUserAction extends ChannelCommand {
  actionChain: string[];
}
export interface EditMessage extends MessageCommand {
  anonym: boolean;
  newText: string;
}
export interface MessageUserAction extends MessageCommand {
  actionChain: string[];
  parameters: Record<string, Record<string, string>>;
}
export interface NewMessage extends TopicCommand {
  anonym: boolean;
  downloadUrl?: string;
  text: string;
}
export interface NewTopic extends TabCommand {
  anonym: boolean;
  downloadUrl?: string;
  text: string;
  topicType: string;
}
export interface SearchTabContent extends TabCommand {
  searchTerm: string;
}
export type SubscribeChannel = ChannelCommand;
export type SubscribeTabWithClick = TabCommand;
export type SubscribeTabWithScrollDownwards = TabCommand;
export type SubscribeTopicWithClick = TopicCommand;
export type SubscribeTopicWithScrollDownwards = TopicCommand;
export interface TopicUserAction extends TopicCommand {
  actionChain: string[];
  parameters: Record<string, Record<string, string>>;
}

export interface VoteTopic extends TopicCommand {
  voteType: VoteType;
}
export interface VoteMessage extends MessageCommand {
  voteType: VoteType;
}

export interface SendChatActions extends ServerCommand {
  clientChatActions: ChatAction[];
}
export interface SendChatTags extends ServerCommand {
  clientChatTags: ChatTag[];
}
export interface SendTopicTypeDescriptors extends ServerCommand {
  descriptors: TopicTypeDescriptor[];
}
export interface ShowToast extends ServerCommand {
  text: string;
}
export interface UpdateChannels extends ServerCommand {
  channels: RawChannel[];
}
export interface UpdateMessages extends ServerCommand {
  deleteOtherMessagesInTopic: string;
  loadOnScrollDownwardsTopics: Record<string, boolean>;
  loadOnScrollUpwardsTopics: Record<string, boolean>;
  messages: RawMessage[];
}
export interface UpdateSetting extends ServerCommand {
  id: string;
  value: string;
}
export interface UpdateTabs extends ServerCommand {
  tabs: RawTab[];
}
export interface UpdateTopics extends ServerCommand {
  deleteOtherTopicsInTab: string;
  loadOnScrollDownwardsTabs: Record<string, boolean>;
  loadOnScrollUpwardsTabs: Record<string, boolean>;
  topics: RawTopic[];
}

export interface ServerCommands {
  SendChatActions: SendChatActions;
  SendChatTags: SendChatTags;
  SendTopicTypeDescriptors: SendTopicTypeDescriptors;
  ShowToast: ShowToast;
  UpdateChannels: UpdateChannels;
  UpdateMessages: UpdateMessages;
  UpdateSetting: UpdateSetting;
  UpdateTabs: UpdateTabs;
  UpdateTopics: UpdateTopics;
}
interface ClientCommandNames {
  ChannelUserAction: ChannelUserAction;
  EditMessage: EditMessage;
  MessageUserAction: MessageUserAction;
  NewMessage: NewMessage;
  NewTopic: NewTopic;
  SearchTabContent: SearchTabContent;
  SubscribeChannel: SubscribeChannel;
  SubscribeTabWithClick: SubscribeTabWithClick;
  SubscribeTabWithScrollDownwards: SubscribeTabWithScrollDownwards;
  SubscribeTopicWithClick: SubscribeTopicWithClick;
  SubscribeTopicWithScrollDownwards: SubscribeTopicWithScrollDownwards;
  TopicUserAction: TopicUserAction;
  VoteMessage: VoteMessage;
  VoteTopic: VoteTopic;
}

export type ClientCommands = {
  [name in keyof ClientCommandNames]: Omit<ClientCommandNames[name], keyof ClientCommand>;
};

export interface ChatTag {
  color: string; // hex
  filled: boolean;
  id: string;
  text: string;
}

export interface ChatAction {
  actionChainHeadline: string;
  color: string; // hex
  filled: boolean;
  id: string;
  lineSortScore: number;
  nextActionIds: string[];
  nextActionIdsRaw: string;
  optimisticUiActions: string[];
  optimisticUiActionsRaw: string;
  text: string;
  textInputPlaceholder: string;
  textInputRegex: string;
  type: 'BUTTON' | 'TEXTINPUT';
}

export interface TopicTypeDescriptor {
  id: string;
  text: string;
}
