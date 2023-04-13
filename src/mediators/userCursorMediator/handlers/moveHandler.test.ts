import { BlockRectStore } from '../../../BlockRectStore';
import { BlockStore } from '../../../BlockStore';
import { HighlightBlockCommand } from '../../../commands/highlightBlock/HighlightBlockCommand';
import { Vector } from '../../../math/Vector';
import { BlockRectMother } from '../../../testUtils/mothers/BlockRectMother';
import { CommandBus } from '../../../utils/CommandBus';
import { CursorEvent } from '../UserCursorInteractionMediator';
import { moveHandler } from './moveHandler';

describe(moveHandler, () => {
  let commandBus: CommandBus;
  let blockStore: BlockStore;
  let blockRectStore: BlockRectStore;
  let blockRectMother: BlockRectMother;

  beforeEach(() => {
    commandBus = new CommandBus();
    blockStore = new BlockStore();
    blockRectStore = new BlockRectStore();
    blockRectMother = new BlockRectMother();

    blockStore.add('text');
    blockStore.add('text');
    blockRectStore.attach(1, blockRectMother.withSmallSize().build());
    blockRectStore.attach(2, blockRectMother.withSmallSize().underLast().build());
  });

  it(`emits the ${HighlightBlockCommand.name} on the first block mouse hover`, () => {
    const cursorEvent = new CursorEvent('move', {
      position: new Vector(10, 10),
    });
    const highlightBlockHandler = jest.fn();

    commandBus.registerHandler(HighlightBlockCommand, highlightBlockHandler);
    moveHandler(cursorEvent, blockStore, blockRectStore, commandBus);

    expect(highlightBlockHandler).toBeCalledWith(new HighlightBlockCommand(1));
  });

  it(`emits the ${HighlightBlockCommand.name} on the second block mouse hover`, () => {
    const cursorEvent = new CursorEvent('move', {
      position: new Vector(10, 35),
    });
    const highlightBlockHandler = jest.fn();

    commandBus.registerHandler(HighlightBlockCommand, highlightBlockHandler);
    moveHandler(cursorEvent, blockStore, blockRectStore, commandBus);

    expect(highlightBlockHandler).toBeCalledWith(new HighlightBlockCommand(2));
  });

  it(`does not emit the ${HighlightBlockCommand.name} if the hovered block is already highlighted`, () => {
    const cursorEvent = new CursorEvent('move', {
      position: new Vector(10, 10),
    });
    const highlightBlockHandler = jest.fn();

    commandBus.registerHandler(HighlightBlockCommand, highlightBlockHandler);
    moveHandler(cursorEvent, blockStore, blockRectStore, commandBus);

    blockStore.highlightedBlock = blockStore.blocks.get(1);

    moveHandler(cursorEvent, blockStore, blockRectStore, commandBus);

    expect(highlightBlockHandler).toBeCalledTimes(1);
  });
});
