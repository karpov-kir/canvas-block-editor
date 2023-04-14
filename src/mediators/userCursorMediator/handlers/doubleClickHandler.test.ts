import { AddBlockCommand } from '../../../commands/addBlock/AddBlockCommand';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { doubleClickHandler } from './doubleClickHandler';

describe(doubleClickHandler, () => {
  let commandBus: CommandBus;

  beforeEach(() => {
    commandBus = new CommandBus();
  });

  it(`emits the ${AddBlockCommand.name} on a double click`, () => {
    const addBlockHandler = jest.fn();

    commandBus.subscribe(AddBlockCommand, addBlockHandler);
    doubleClickHandler(commandBus);

    expect(addBlockHandler).toBeCalledWith(expect.any(AddBlockCommand));
  });
});
