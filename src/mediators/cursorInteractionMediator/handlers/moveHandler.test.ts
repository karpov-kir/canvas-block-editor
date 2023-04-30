import { HighlightBlockCommand } from '../../../commands/highlightBlock/HighlightBlockCommand';
import { RemoveHighlightFromBlockCommand } from '../../../commands/removeHighlightFromBlock/RemoveHighlightFromBlockCommand';
import { BlockRectStore } from '../../../stores/BlockRectStore';
import { BlockStore, BlockType } from '../../../stores/BlockStore';
import { CommandHandlerStub } from '../../../testUtils/CommandHandlerStub';
import { BlockRectMother } from '../../../testUtils/mothers/BlockRectMother';
import { Vector } from '../../../utils/math/Vector';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { CursorInteractionMoveEvent } from '../CursorInteractionMediator';
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
    const highlightBlockCommandHandler = new CommandHandlerStub();

    commandBus.subscribe(HighlightBlockCommand, highlightBlockCommandHandler);
    moveHandler(new CursorInteractionMoveEvent(new Vector(10, 10)), blockStore, blockRectStore, commandBus);

    expect(highlightBlockCommandHandler.execute).toBeCalledWith(new HighlightBlockCommand(1));
  });

  it(`emits the ${HighlightBlockCommand.name} on the second block mouse hover`, () => {
    const highlightBlockCommandHandler = new CommandHandlerStub();

    commandBus.subscribe(HighlightBlockCommand, highlightBlockCommandHandler);
    moveHandler(new CursorInteractionMoveEvent(new Vector(10, 50)), blockStore, blockRectStore, commandBus);

    expect(highlightBlockCommandHandler.execute).toBeCalledWith(new HighlightBlockCommand(2));
  });

  it(`does not emit the ${HighlightBlockCommand.name} if the hovered block is already highlighted`, () => {
    const moveEvent = new CursorInteractionMoveEvent(new Vector(10, 10));
    const highlightBlockCommandHandler = new CommandHandlerStub();

    commandBus.subscribe(HighlightBlockCommand, highlightBlockCommandHandler);
    moveHandler(moveEvent, blockStore, blockRectStore, commandBus);

    blockStore.highlightedBlock = blockStore.blocks.get(1);

    moveHandler(moveEvent, blockStore, blockRectStore, commandBus);

    expect(highlightBlockCommandHandler.execute).toBeCalledTimes(1);
  });

  it(`emits the ${RemoveHighlightFromBlockCommand.name} on mouse move outside of the highlighted block`, () => {
    const removeHighlightFromBlockCommandHandler = new CommandHandlerStub();

    blockStore.highlightedBlock = blockStore.blocks.get(1);

    commandBus.subscribe(RemoveHighlightFromBlockCommand, removeHighlightFromBlockCommandHandler);
    moveHandler(new CursorInteractionMoveEvent(new Vector(-100, -100)), blockStore, blockRectStore, commandBus);

    expect(removeHighlightFromBlockCommandHandler.execute).toBeCalledTimes(1);
  });

  it(`does not emit the ${RemoveHighlightFromBlockCommand.name} on mouse move outside of the blocks if there is no a highlighted block`, () => {
    const removeHighlightFromBlockCommandHandler = new CommandHandlerStub();

    commandBus.subscribe(RemoveHighlightFromBlockCommand, removeHighlightFromBlockCommandHandler);
    moveHandler(new CursorInteractionMoveEvent(new Vector(-100, -100)), blockStore, blockRectStore, commandBus);

    expect(removeHighlightFromBlockCommandHandler.execute).not.toBeCalled();
  });
});
