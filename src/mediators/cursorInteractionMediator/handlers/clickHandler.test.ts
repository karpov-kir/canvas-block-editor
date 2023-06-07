import { AddBlockCommand } from '../../../commands/addBlock/AddBlockCommand';
import { ChangeBlockTypeCommand } from '../../../commands/changeBlockType/ChangeBlockTypeCommand';
import { FocusBlockCommand } from '../../../commands/focusBlock/FocusBlockCommand';
import { RemoveFocusFromBlockCommand } from '../../../commands/removeFocusFromBlock/RemoveFocusFromBlockCommand';
import { BlockRectStore } from '../../../stores/BlockRectStore';
import { BlockStore, BlockType } from '../../../stores/BlockStore';
import { FakeHandlerStub } from '../../../testUtils/FakeCommandHandler';
import { getPointInBlockRect } from '../../../testUtils/getPointInBlockRect';
import { BlockMother } from '../../../testUtils/mothers/BlockMother';
import { BlockRectMother } from '../../../testUtils/mothers/BlockRectMother';
import { Vector } from '../../../utils/math/Vector';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { CursorInteractionClickEvent } from '../CursorInteractionMediator';
import { clickHandler } from './clickHandler';

describe(clickHandler, () => {
  let commandBus: CommandBus;
  let blockStore: BlockStore;
  let blockRectStore: BlockRectStore;
  let blockRectMother: BlockRectMother;
  let blockMother: BlockMother;

  beforeEach(() => {
    commandBus = new CommandBus();
    blockStore = new BlockStore();
    blockRectStore = new BlockRectStore();
    blockRectMother = new BlockRectMother();
    blockMother = new BlockMother();

    blockStore.blocks.set(blockMother.create().id, blockMother.last);
    blockRectStore.attach(blockMother.last.id, blockRectMother.withSmallSize().create());

    blockStore.blocks.set(blockMother.create().id, blockMother.last);
    blockRectStore.attach(blockMother.last.id, blockRectMother.withSmallSize().underLast().create());
  });

  it(`emits the ${FocusBlockCommand.name} on a click on a block`, () => {
    const focusedBlockCommandHandler = new FakeHandlerStub();

    commandBus.subscribe(FocusBlockCommand, focusedBlockCommandHandler);

    clickHandler(
      new CursorInteractionClickEvent(getPointInBlockRect(blockRectMother.last)),
      blockStore,
      blockRectStore,
      commandBus,
    );

    expect(focusedBlockCommandHandler.execute).toBeCalledTimes(1);
  });

  it(`does not emit the ${FocusBlockCommand.name} if the clicked block is already focused`, () => {
    const focusedBlockCommandHandler = new FakeHandlerStub();

    blockStore.focusBlock(blockMother.last.id);
    commandBus.subscribe(FocusBlockCommand, focusedBlockCommandHandler);

    clickHandler(
      new CursorInteractionClickEvent(getPointInBlockRect(blockRectMother.last)),
      blockStore,
      blockRectStore,
      commandBus,
    );

    expect(focusedBlockCommandHandler.execute).not.toBeCalled();
  });

  it(`changes the "${BlockType.CreateBlock}" block type to another type on a click, focuses the block, and adds a new block with type "${BlockType.CreateBlock}" to the end`, () => {
    const focusBlockCommandHandler = new FakeHandlerStub();
    const changeBlockTypeCommandHandler = new FakeHandlerStub();
    const addBlockCommandHandler = new FakeHandlerStub();

    blockStore.blocks.set(blockMother.withType(BlockType.CreateBlock).create().id, blockMother.last);
    blockRectStore.attach(blockMother.last.id, blockRectMother.withSmallSize().underLast().create());
    commandBus.subscribe(FocusBlockCommand, focusBlockCommandHandler);
    commandBus.subscribe(ChangeBlockTypeCommand, changeBlockTypeCommandHandler);
    commandBus.subscribe(AddBlockCommand, addBlockCommandHandler);

    clickHandler(
      new CursorInteractionClickEvent(getPointInBlockRect(blockRectMother.last)),
      blockStore,
      blockRectStore,
      commandBus,
    );

    expect(focusBlockCommandHandler.execute).toBeCalledTimes(1);
    expect(changeBlockTypeCommandHandler.execute).toBeCalledTimes(1);
    expect(addBlockCommandHandler.execute).toBeCalledTimes(1);
    expect(addBlockCommandHandler.execute).toBeCalledWith(new AddBlockCommand(BlockType.CreateBlock));
  });

  it(`emits the ${RemoveFocusFromBlockCommand.name} on a click outside of focused blocks`, () => {
    const removeFocusFromBlockCommandHandler = new FakeHandlerStub();

    blockStore.blocks.set(blockMother.create().id, blockMother.last);
    blockStore.focusBlock(blockMother.last.id);
    commandBus.subscribe(RemoveFocusFromBlockCommand, removeFocusFromBlockCommandHandler);

    clickHandler(new CursorInteractionClickEvent(new Vector(-100, -100)), blockStore, blockRectStore, commandBus);

    expect(removeFocusFromBlockCommandHandler.execute).toBeCalledTimes(1);
    expect(removeFocusFromBlockCommandHandler.execute).toBeCalledWith(
      new RemoveFocusFromBlockCommand(blockMother.last.id),
    );
  });
});
