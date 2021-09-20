import { Collection as CollectionDJS } from '@discordjs/collection';
export const Collection = CollectionDJS;

export * from './auth/sms';
export * from './chat';
export * from './client';
export * as config from './config';
export * from './rest/restManager';
export * from './utils';
