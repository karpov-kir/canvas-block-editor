import { AddBlockCommand } from '../../../commands/addBlock/AddBlockCommand';
import { CommandHandlerStub } from '../../../testUtils/CommandHandlerStub';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { doubleClickHandler } from './doubleClickHandler';

describe(doubleClickHandler, () => {
  let commandBus: CommandBus;

  beforeEach(() => {
    commandBus = new CommandBus();
  });

  it(`emits the ${AddBlockCommand.name} on a double click`, () => {
    const addBlockHandler = new CommandHandlerStub();

    commandBus.subscribe(AddBlockCommand, addBlockHandler);
    doubleClickHandler(new MouseEvent('dbclick'), commandBus);

    expect(addBlockHandler.execute).toBeCalledWith(expect.any(AddBlockCommand));
  });
});
