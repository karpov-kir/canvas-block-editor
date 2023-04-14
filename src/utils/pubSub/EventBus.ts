import { ConstructorOf } from '../types';
import { Event } from './Event';
import { ClassBasedPubSub } from './PubSub';

export class EventBus extends ClassBasedPubSub<ConstructorOf<Event>, Event> {}
