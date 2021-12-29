import { RawChannel } from '../src/chat/channel';
import { ServerCommand } from '../src/chat/command';
import { RawTab } from '../src/chat/tab';

export function mockServerCommand<T extends Record<string, unknown>>(
  options: T = {} as T
): ServerCommand & T {
  return {
    commandId: 'cmdId',
    lastClientActionId: 0,
    waitForAck: false,
    triggerClientCommandId: 'triggerId',
    ...options,
  };
}

export function mockRawChannel(options?: Partial<RawChannel>): RawChannel {
  return {
    id: '1',
    name: 'name',
    uniId: 'uni',
    sortScore: 0,
    toolbarTitle: 'title',
    footer: 'footer',
    iconChar: 'A',
    pinned: false,
    hidden: false,
    shareText: 'shareText',
    shareUrl: 'https://shareUrl',
    allowedActionIdsRaw: 'A|B',
    actionParametersRaw: JSON.stringify({ param: 'value' }),
    ...options,
  };
}

export function mockRawTab(options?: Partial<RawTab>): RawTab {
  return {
    id: '1',
    channelId: 'channelId',
    title: 'title',
    defaultTopicId: 'defaultTopicId',
    sortScore: 0,
    hidden: false,
    notificationEnabled: false,
    enableNewTopics: false,
    enableFileUpload: false,
    stickyInfo: 'sticky',
    shareUrl: 'https://shareUrl',
    votingTypeRaw: 'UP_AND_DOWN',
    toolbarActionRaw: 'NOTIFICATION_TOGGLE',
    allowedTopicTypesRaw: 'A|B',
    defaultTopicTypeRaw: 'GENERAL',
    privacyTypeRaw: 'FORCE_NAME',
    ...options,
  };
}
