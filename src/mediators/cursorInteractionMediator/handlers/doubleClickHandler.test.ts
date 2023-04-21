import { AddBlockCommand } from '../../../commands/addBlock/AddBlockCommand';
import { CommandHandlerStub } from '../../../testUtils/CommandHandlerStub';
import { Vector } from '../../../utils/math/Vector';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { CursorInteractionDoubleClickEvent } from '../CursorInteractionMediator';
import { doubleClickHandler } from './doubleClickHandler';

describe(doubleClickHandler, () => {
  let commandBus: CommandBus;

  beforeEach(() => {
    commandBus = new CommandBus();
  });

  it(`emits the ${AddBlockCommand.name} on a double click`, () => {
    const addBlockHandler = new CommandHandlerStub();

    commandBus.subscribe(AddBlockCommand, addBlockHandler);
    doubleClickHandler(new CursorInteractionDoubleClickEvent(new Vector()), commandBus);

    expect(addBlockHandler.execute).toBeCalledWith(expect.any(AddBlockCommand));
  });
});
