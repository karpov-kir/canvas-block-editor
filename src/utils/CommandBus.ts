import { Command } from './Command';

type CommandHandler = (command: Command) => void;

export class CommandBus {
  private handlers: Map<Command, CommandHandler[]> = new Map();

  public registerHandler(command: Command, handler: CommandHandler) {
    const handlers = this.handlers.get(command) || [];
    this.handlers.set(command, [...handlers, handler]);
  }

  public publish(command: Command) {
    const handlers = this.handlers.get(command.constructor) || [];
    handlers.forEach((handler) => handler(command));
  }
}
