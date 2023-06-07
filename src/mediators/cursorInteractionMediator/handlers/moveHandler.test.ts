import { HighlightBlockCommand } from '../../../commands/highlightBlock/HighlightBlockCommand';
import { RemoveHighlightFromBlockCommand } from '../../../commands/removeHighlightFromBlock/RemoveHighlightFromBlockCommand';
import { BlockRectStore } from '../../../stores/BlockRectStore';
import { BlockStore } from '../../../stores/BlockStore';
import { FakeHandlerStub } from '../../../testUtils/FakeCommandHandler';
import { getPointInBlockRect } from '../../../testUtils/getPointInBlockRect';
import { BlockMother } from '../../../testUtils/mothers/BlockMother';
import { BlockRectMother } from '../../../testUtils/mothers/BlockRectMother';
import { Vector } from '../../../utils/math/Vector';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { CursorInteractionMoveEvent } from '../CursorInteractionMediator';
import { moveHandler } from './moveHandler';

describe(moveHandler, () => {
  let commandBus: CommandBus;
  let blockStore: BlockStore;
  let blockRectStore: BlockRectStore;
  let blockMother: BlockMother;
  let blockRectMother: BlockRectMother;

  beforeEach(() => {
    commandBus = new CommandBus();
    blockStore = new BlockStore();
    blockRectStore = new BlockRectStore();
    blockMother = new BlockMother();
    blockRectMother = new BlockRectMother();

    blockStore.blocks.set(blockMother.create().id, blockMother.last);
    blockRectStore.attach(blockMother.last.id, blockRectMother.withSmallSize().create());
    blockStore.blocks.set(blockMother.create().id, blockMother.last);
    blockRectStore.attach(blockMother.last.id, blockRectMother.withSmallSize().underLast().create());
  });

  it(`emits the ${HighlightBlockCommand.name} on the first block mouse hover`, () => {
    const highlightBlockCommandHandler = new FakeHandlerStub();

    commandBus.subscribe(HighlightBlockCommand, highlightBlockCommandHandler);

    moveHandler(
      new CursorInteractionMoveEvent(getPointInBlockRect(blockRectMother.beforeLast)),
      blockStore,
      blockRectStore,
      commandBus,
    );

    expect(highlightBlockCommandHandler.execute).toBeCalledWith(new HighlightBlockCommand(blockMother.beforeLast.id));
  });

  it(`does not emit the ${HighlightBlockCommand.name} if the hovered block is already highlighted`, () => {
    const highlightBlockCommandHandler = new FakeHandlerStub();

    commandBus.subscribe(HighlightBlockCommand, highlightBlockCommandHandler);
    blockStore.highlightBlock(blockMother.last.id);

    moveHandler(
      new CursorInteractionMoveEvent(getPointInBlockRect(blockRectMother.last)),
      blockStore,
      blockRectStore,
      commandBus,
    );

    expect(highlightBlockCommandHandler.execute).not.toBeCalled();
  });

  it(`emits the ${RemoveHighlightFromBlockCommand.name} on mouse move outside of the highlighted block`, () => {
    const removeHighlightFromBlockCommandHandler = new FakeHandlerStub();

    blockStore.highlightBlock(blockMother.last.id);
    commandBus.subscribe(RemoveHighlightFromBlockCommand, removeHighlightFromBlockCommandHandler);

    moveHandler(new CursorInteractionMoveEvent(new Vector(-100, -100)), blockStore, blockRectStore, commandBus);

    expect(removeHighlightFromBlockCommandHandler.execute).toBeCalledTimes(1);
    expect(removeHighlightFromBlockCommandHandler.execute).toBeCalledWith(
      new RemoveHighlightFromBlockCommand(blockMother.last.id),
    );
  });

  it(`does not emit the ${RemoveHighlightFromBlockCommand.name} on mouse move outside of the blocks if there is no a highlighted block`, () => {
    const removeHighlightFromBlockCommandHandler = new FakeHandlerStub();

    commandBus.subscribe(RemoveHighlightFromBlockCommand, removeHighlightFromBlockCommandHandler);

    moveHandler(new CursorInteractionMoveEvent(new Vector(-100, -100)), blockStore, blockRectStore, commandBus);

    expect(removeHighlightFromBlockCommandHandler.execute).not.toBeCalled();
  });

  it(`emit the ${RemoveHighlightFromBlockCommand.name} for the first block on mouse move to the second block `, () => {
    const removeHighlightFromBlockCommandHandler = new FakeHandlerStub();

    blockStore.highlightBlock(blockMother.beforeLast.id);
    commandBus.subscribe(RemoveHighlightFromBlockCommand, removeHighlightFromBlockCommandHandler);

    moveHandler(
      new CursorInteractionMoveEvent(getPointInBlockRect(blockRectMother.last)),
      blockStore,
      blockRectStore,
      commandBus,
    );

    expect(removeHighlightFromBlockCommandHandler.execute).toBeCalledTimes(1);
    expect(removeHighlightFromBlockCommandHandler.execute).toBeCalledWith(
      new RemoveHighlightFromBlockCommand(blockMother.beforeLast.id),
    );
  });
});
