import { ConstructorOf } from '../types';
import { Command, CommandHandler } from './Command';
import { PubSub } from './PubSub';

export class CommandBus extends PubSub<ConstructorOf<Command>, CommandHandler, Command> {
  protected override execute(command: Command, handler: CommandHandler) {
    handler.execute(command);
  }

  public override publish(command: Command) {
    super.publish(command.constructor as ConstructorOf<Command>, command);
  }
}
