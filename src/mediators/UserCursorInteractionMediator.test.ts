import { BlockStore } from '../BlockStore';
import { AddBlockCommand } from '../commands/addBlock/AddBlockCommand';
import { HighlightBlockCommand } from '../commands/highlightBlock/HighlightBlockCommand';
import { CommandBus } from '../utils/CommandBus';
import { CursorEvent, UserCursorInteractionMediator } from './UserCursorInteractionMediator';

describe(UserCursorInteractionMediator, () => {
  let commandBus: CommandBus;
  let mediator: UserCursorInteractionMediator;
  let blockStore: BlockStore;

  beforeEach(() => {
    commandBus = new CommandBus();
    blockStore = new BlockStore();
    mediator = new UserCursorInteractionMediator(commandBus, blockStore);
  });

  it(`emits the ${AddBlockCommand.name} on a double click`, () => {
    const cursorEvent = new CursorEvent('double-click', { x: 0, y: 0 });
    const addBlockHandler = jest.fn();

    commandBus.registerHandler(AddBlockCommand, addBlockHandler);
    mediator.notify(cursorEvent);

    expect(addBlockHandler).toBeCalledWith(expect.any(AddBlockCommand));
  });

  it(`emits the ${HighlightBlockCommand.name} on mouse hover`, () => {
    const cursorEvent = new CursorEvent('move', { x: 10, y: 10 });
    const highlightBlockHandler = jest.fn();

    blockStore.add('text', { x: 0, y: 0 });
    commandBus.registerHandler(HighlightBlockCommand, highlightBlockHandler);
    mediator.notify(cursorEvent);

    expect(highlightBlockHandler).toBeCalledWith(expect.any(HighlightBlockCommand));
  });
});
