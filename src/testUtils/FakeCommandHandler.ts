import { CommandHandler } from '../utils/pubSub/Command';

export class FakeHandlerStub extends CommandHandler {
  public readonly execute = jest.fn();
}
