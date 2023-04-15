import { CommandHandler } from '../utils/pubSub/Command';

export class CommandHandlerStub extends CommandHandler {
  public readonly execute = jest.fn();
}
