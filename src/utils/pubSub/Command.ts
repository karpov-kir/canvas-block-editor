export class Command {}

export abstract class CommandHandler {
  public abstract execute(command: Command): void;
}
