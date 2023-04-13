import { BlockRect, BlockRectStore, Padding } from '../BlockRectStore';
import { BlockStore } from '../BlockStore';
import { AddBlockCommand } from '../commands/addBlock/AddBlockCommand';
import { HighlightBlockCommand } from '../commands/highlightBlock/HighlightBlockCommand';
import { Dimensions } from '../math/Dimensions';
import { Vector } from '../math/Vector';
import { CommandBus } from '../utils/CommandBus';
import { CursorEvent, UserCursorInteractionMediator } from './UserCursorInteractionMediator';

describe(UserCursorInteractionMediator, () => {
  let commandBus: CommandBus;
  let mediator: UserCursorInteractionMediator;
  let blockStore: BlockStore;
  let blockRectStore: BlockRectStore;

  beforeEach(() => {
    commandBus = new CommandBus();
    blockStore = new BlockStore();
    blockRectStore = new BlockRectStore();
    mediator = new UserCursorInteractionMediator(commandBus, blockStore, blockRectStore);
  });

  it(`emits the ${AddBlockCommand.name} on a double click`, () => {
    const cursorEvent = new CursorEvent('double-click', { position: new Vector() });
    const addBlockHandler = jest.fn();

    commandBus.registerHandler(AddBlockCommand, addBlockHandler);
    mediator.notify(cursorEvent);

    expect(addBlockHandler).toBeCalledWith(expect.any(AddBlockCommand));
  });

  it(`emits the ${HighlightBlockCommand.name} on mouse hover`, () => {
    const cursorEvent = new CursorEvent('move', {
      position: new Vector(10, 10),
    });
    const highlightBlockHandler = jest.fn();

    blockStore.add('text');
    blockRectStore.attach(1, new BlockRect(1, new Padding(), new Vector(), new Dimensions(100, 100)));
    commandBus.registerHandler(HighlightBlockCommand, highlightBlockHandler);
    mediator.notify(cursorEvent);

    expect(highlightBlockHandler).toBeCalledWith(expect.any(HighlightBlockCommand));
  });
});
