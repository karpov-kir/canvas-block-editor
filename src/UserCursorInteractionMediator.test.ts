import { AddBlockCommand } from './commands/addBlock/AddBlockCommand';
import { CursorEvent, UserCursorInteractionMediator } from './UserCursorInteractionMediator';
import { CommandBus } from './utils/CommandBus';

describe(UserCursorInteractionMediator, () => {
  it(`emits the ${AddBlockCommand.name} on a double click`, () => {
    const commandBus = new CommandBus();
    const mediator = new UserCursorInteractionMediator(commandBus);
    const cursorEvent = new CursorEvent('double-click');
    const addBlockHandler = jest.fn();

    commandBus.registerHandler(AddBlockCommand, addBlockHandler);
    mediator.notify(cursorEvent);

    expect(addBlockHandler).toBeCalledWith(expect.any(AddBlockCommand));
  });
});
