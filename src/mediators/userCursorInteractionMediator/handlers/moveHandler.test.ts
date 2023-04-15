import { HighlightBlockCommand } from '../../../commands/highlightBlock/HighlightBlockCommand';
import { RemoveHighlightFromBlockCommand } from '../../../commands/removeHighlightFromBlock/RemoveHighlightFromBlockCommand';
import { Vector } from '../../../math/Vector';
import { BlockRectStore } from '../../../stores/BlockRectStore';
import { BlockStore, BlockType } from '../../../stores/BlockStore';
import { CommandHandlerStub } from '../../../testUtils/CommandHandlerStub';
import { BlockRectMother } from '../../../testUtils/mothers/BlockRectMother';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
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

    blockStore.add(BlockType.Text);
    blockStore.add(BlockType.Text);
    blockRectStore.attach(1, blockRectMother.withSmallSize().create());
    blockRectStore.attach(2, blockRectMother.withSmallSize().underLast().create());
  });

  it(`emits the ${HighlightBlockCommand.name} on the first block mouse hover`, () => {
    const cursorEvent = new CursorEvent('move', {
      position: new Vector(10, 10),
    });
    const highlightBlockHandler = new CommandHandlerStub();

    commandBus.subscribe(HighlightBlockCommand, highlightBlockHandler);
    moveHandler(cursorEvent, blockStore, blockRectStore, commandBus);

    expect(highlightBlockHandler.execute).toBeCalledWith(new HighlightBlockCommand(1));
  });

  it(`emits the ${HighlightBlockCommand.name} on the second block mouse hover`, () => {
    const cursorEvent = new CursorEvent('move', {
      position: new Vector(10, 35),
    });
    const highlightBlockHandler = new CommandHandlerStub();

    commandBus.subscribe(HighlightBlockCommand, highlightBlockHandler);
    moveHandler(cursorEvent, blockStore, blockRectStore, commandBus);

    expect(highlightBlockHandler.execute).toBeCalledWith(new HighlightBlockCommand(2));
  });

  it(`does not emit the ${HighlightBlockCommand.name} if the hovered block is already highlighted`, () => {
    const cursorEvent = new CursorEvent('move', {
      position: new Vector(10, 10),
    });
    const highlightBlockHandler = new CommandHandlerStub();

    commandBus.subscribe(HighlightBlockCommand, highlightBlockHandler);
    moveHandler(cursorEvent, blockStore, blockRectStore, commandBus);

    blockStore.highlightedBlock = blockStore.blocks.get(1);

    moveHandler(cursorEvent, blockStore, blockRectStore, commandBus);

    expect(highlightBlockHandler.execute).toBeCalledTimes(1);
  });

  it(`emits the ${RemoveHighlightFromBlockCommand.name} on mouse hover outside of the highlighted block`, () => {
    const cursorEvent = new CursorEvent('move', {
      position: new Vector(-100, -100),
    });
    const removeHighlightFromBlockHandler = new CommandHandlerStub();

    blockStore.highlightedBlock = blockStore.blocks.get(1);

    commandBus.subscribe(RemoveHighlightFromBlockCommand, removeHighlightFromBlockHandler);
    moveHandler(cursorEvent, blockStore, blockRectStore, commandBus);

    expect(removeHighlightFromBlockHandler.execute).toBeCalledTimes(1);
  });

  it(`emits the ${RemoveHighlightFromBlockCommand.name} on mouse hover outside of blocks if there is no a highlighted block`, () => {
    const cursorEvent = new CursorEvent('move', {
      position: new Vector(-100, -100),
    });
    const removeHighlightFromBlockHandler = new CommandHandlerStub();

    commandBus.subscribe(RemoveHighlightFromBlockCommand, removeHighlightFromBlockHandler);
    moveHandler(cursorEvent, blockStore, blockRectStore, commandBus);

    expect(removeHighlightFromBlockHandler.execute).not.toBeCalled();
  });
});
