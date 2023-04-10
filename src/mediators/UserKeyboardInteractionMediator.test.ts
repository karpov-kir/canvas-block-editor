import { InputCommand } from '../commands/inputCommand/InputCommand';
import { CommandBus } from '../utils/CommandBus';
import { KeyboardEvent, UserKeyboardInteractionMediator } from './UserKeyboardInteractionMediator';

describe(UserKeyboardInteractionMediator, () => {
  it(`emits the ${InputCommand.name} on a key press`, () => {
    const commandBus = new CommandBus();
    const mediator = new UserKeyboardInteractionMediator(commandBus);
    const keyboardEvent = new KeyboardEvent('key-press', 'T');
    const inputCommandHandler = jest.fn();

    commandBus.registerHandler(InputCommand, inputCommandHandler);
    mediator.notify(keyboardEvent);

    expect(inputCommandHandler).toBeCalledWith(expect.any(InputCommand));
  });
});
