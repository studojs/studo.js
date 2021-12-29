import { Collection } from '../utils';
import { Channel } from './channel';
import { ChatAction, ChatTag, TopicTypeDescriptor } from './command';
import { Message } from './message';
import { Tab } from './tab';
import { Topic } from './topic';

export class Cache {
  channels = new Collection<Channel>();
  tabs = new Collection<Tab>();
  topics = new Collection<Topic>();
  messages = new Collection<Message>();
  settings = new Collection<string>();
  chatActions = new Collection<ChatAction>();
  chatTags = new Collection<ChatTag>();
  topicTypeDescriptors = new Collection<TopicTypeDescriptor>();
}
