import { ConstructorOf } from '../types';
import { Command } from './Command';
import { ClassBasedPubSub } from './PubSub';

export class CommandBus extends ClassBasedPubSub<ConstructorOf<Command>, Command> {}
