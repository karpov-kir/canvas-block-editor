import { AddBlockCommand } from '../../../commands/addBlock/AddBlockCommand';
import { ChangeBlockTypeCommand } from '../../../commands/changeBlockType/ChangeBlockTypeCommand';
import { FocusBlockCommand } from '../../../commands/focusBlock/FocusBlockCommand';
import { RemoveFocusFromBlockCommand } from '../../../commands/removeFocusFromBlock/RemoveFocusFromBlockCommand';
import { BlockRectStore } from '../../../stores/BlockRectStore';
import { BlockStore, BlockType } from '../../../stores/BlockStore';
import { CommandHandlerStub } from '../../../testUtils/CommandHandlerStub';
import { ActiveBlockMother } from '../../../testUtils/mothers/ActiveBlockMother';
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
  let activeBlockMother: ActiveBlockMother;
  let blockMother: BlockMother;

  beforeEach(() => {
    commandBus = new CommandBus();
    blockStore = new BlockStore();
    blockRectStore = new BlockRectStore();
    blockRectMother = new BlockRectMother();
    activeBlockMother = new ActiveBlockMother();
    blockMother = new BlockMother();

    blockStore.add(BlockType.Text);
    blockStore.add(BlockType.Text);
    blockRectStore.attach(1, blockRectMother.withSmallSize().create());
    blockRectStore.attach(2, blockRectMother.withSmallSize().underLast().create());
  });

  it(`emits the ${FocusBlockCommand.name} on a click on a block`, () => {
    const clickEvent = new CursorInteractionClickEvent(
      new Vector(
        blockRectStore.getById(1).position.x + blockRectStore.getById(1).margin.horizontal,
        blockRectStore.getById(1).position.y + blockRectStore.getById(1).margin.vertical,
      ),
    );
    const focusedBlockHandler = new CommandHandlerStub();

    commandBus.subscribe(FocusBlockCommand, focusedBlockHandler);
    // Clicking on a not active block should not emit the command
    clickHandler(clickEvent, blockStore, blockRectStore, commandBus);

    blockStore.blocks.set(blockMother.create().id, blockMother.last);
    blockStore.activeBlock = activeBlockMother.withBlock(blockMother.last).create();

    clickHandler(clickEvent, blockStore, blockRectStore, commandBus);

    expect(focusedBlockHandler.execute).toBeCalledTimes(1);
  });

  it(`does not emit the ${FocusBlockCommand.name} if the clicked block is already active`, () => {
    const focusedBlockHandler = new CommandHandlerStub();

    blockStore.blocks.set(blockMother.create().id, blockMother.last);
    blockStore.activeBlock = activeBlockMother.withBlock(blockMother.last).create();

    commandBus.subscribe(FocusBlockCommand, focusedBlockHandler);

    clickHandler(
      new CursorInteractionClickEvent(
        new Vector(
          blockRectStore.getById(1).position.x + blockRectStore.getById(1).margin.horizontal,
          blockRectStore.getById(1).position.y + blockRectStore.getById(1).margin.vertical,
        ),
      ),
      blockStore,
      blockRectStore,
      commandBus,
    );

    expect(focusedBlockHandler.execute).not.toBeCalled();
  });

  it(`changes the "${BlockType.CreateBlock}" block type to another type on a click, focuses the block, and adds a new block with type "${BlockType.CreateBlock}" to the end`, () => {
    const focusBlockCommandHandler = new CommandHandlerStub();
    const changeBlockTypeCommandHandler = new CommandHandlerStub();
    const addBlockHandler = new CommandHandlerStub();

    blockStore.add(BlockType.CreateBlock);
    blockRectStore.attach(3, blockRectMother.withSmallSize().underLast().create());
    commandBus.subscribe(FocusBlockCommand, focusBlockCommandHandler);
    commandBus.subscribe(ChangeBlockTypeCommand, changeBlockTypeCommandHandler);
    commandBus.subscribe(AddBlockCommand, addBlockHandler);
    clickHandler(
      new CursorInteractionClickEvent(
        new Vector(
          blockRectStore.getById(3).position.x + blockRectStore.getById(3).margin.horizontal,
          blockRectStore.getById(3).position.y + blockRectStore.getById(3).margin.vertical,
        ),
      ),
      blockStore,
      blockRectStore,
      commandBus,
    );

    expect(focusBlockCommandHandler.execute).toBeCalledTimes(1);
    expect(changeBlockTypeCommandHandler.execute).toBeCalledTimes(1);
    expect(addBlockHandler.execute).toBeCalledTimes(1);
    expect(addBlockHandler.execute).toBeCalledWith(new AddBlockCommand(BlockType.CreateBlock));
  });

  it(`emits the ${RemoveFocusFromBlockCommand.name} on a click outside of the active block`, () => {
    const clickEvent = new CursorInteractionClickEvent(new Vector(-100, -100));
    const removeFocusFromBlockHandler = new CommandHandlerStub();

    blockStore.blocks.set(blockMother.create().id, blockMother.last);
    blockStore.activeBlock = activeBlockMother.withBlock(blockMother.last).create();

    commandBus.subscribe(RemoveFocusFromBlockCommand, removeFocusFromBlockHandler);
    clickHandler(clickEvent, blockStore, blockRectStore, commandBus);

    blockStore.activeBlock = undefined;

    clickHandler(clickEvent, blockStore, blockRectStore, commandBus);

    expect(removeFocusFromBlockHandler.execute).toBeCalledTimes(1);
  });
});
