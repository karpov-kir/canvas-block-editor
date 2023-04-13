import { AddBlockCommand } from '../../../commands/addBlock/AddBlockCommand';
import { CommandBus } from '../../../utils/CommandBus';
import { doubleClickHandler } from './doubleClickHandler';

describe(doubleClickHandler, () => {
  let commandBus: CommandBus;

  beforeEach(() => {
    commandBus = new CommandBus();
  });

  it(`emits the ${AddBlockCommand.name} on a double click`, () => {
    const addBlockHandler = jest.fn();

    commandBus.registerHandler(AddBlockCommand, addBlockHandler);
    doubleClickHandler(commandBus);

    expect(addBlockHandler).toBeCalledWith(expect.any(AddBlockCommand));
  });
});
