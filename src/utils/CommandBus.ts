import { BaseCommand } from './BaseCommand';

type CommandHandler = (command: BaseCommand) => void;

export class CommandBus {
  private handlers: Map<BaseCommand, CommandHandler[]> = new Map();

  public registerHandler(command: BaseCommand, handler: CommandHandler) {
    const handlers = this.handlers.get(command) || [];
    this.handlers.set(command, [...handlers, handler]);
  }

  public publish(command: BaseCommand) {
    const handlers = this.handlers.get(command.constructor) || [];
    handlers.forEach((handler) => handler(command));
  }
}
