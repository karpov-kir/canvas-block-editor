import { AddBlockCommand } from '../../../commands/addBlock/AddBlockCommand';
import { ChangeBlockTypeCommand } from '../../../commands/changeBlockType/ChangeBlockTypeCommand';
import { FocusBlockCommand } from '../../../commands/focusBlock/FocusBlockCommand';
import { Vector } from '../../../math/Vector';
import { BlockRectStore } from '../../../stores/BlockRectStore';
import { BlockStore, BlockType } from '../../../stores/BlockStore';
import { ActiveBlockMother } from '../../../testUtils/mothers/ActiveBlockMother';
import { BlockRectMother } from '../../../testUtils/mothers/BlockRectMother';
import { CommandBus } from '../../../utils/CommandBus';
import { CursorEvent } from '../UserCursorInteractionMediator';
import { clickHandler } from './clickHandler';

describe(clickHandler, () => {
  let commandBus: CommandBus;
  let blockStore: BlockStore;
  let blockRectStore: BlockRectStore;
  let blockRectMother: BlockRectMother;
  let activeBlockMother: ActiveBlockMother;

  beforeEach(() => {
    commandBus = new CommandBus();
    blockStore = new BlockStore();
    blockRectStore = new BlockRectStore();
    blockRectMother = new BlockRectMother();
    activeBlockMother = new ActiveBlockMother();

    blockStore.add(BlockType.Text);
    blockStore.add(BlockType.Text);
    blockRectStore.attach(1, blockRectMother.withSmallSize().create());
    blockRectStore.attach(2, blockRectMother.withSmallSize().underLast().create());
  });

  it(`emits the ${FocusBlockCommand.name} on a click`, () => {
    const cursorEvent = new CursorEvent('click', {
      position: new Vector(10, 10),
    });
    const focusedBlockHandler = jest.fn();

    commandBus.registerHandler(FocusBlockCommand, focusedBlockHandler);
    clickHandler(cursorEvent, blockStore, blockRectStore, commandBus);

    blockStore.activeBlock = activeBlockMother.create();

    clickHandler(cursorEvent, blockStore, blockRectStore, commandBus);

    expect(focusedBlockHandler).toBeCalledTimes(1);
  });

  it(`does not emit the ${FocusBlockCommand.name} if the clicked block is already active`, () => {
    const cursorEvent = new CursorEvent('click', {
      position: new Vector(10, 10),
    });
    const focusedBlockHandler = jest.fn();

    commandBus.registerHandler(FocusBlockCommand, focusedBlockHandler);
    blockStore.activeBlock = activeBlockMother.create();

    clickHandler(cursorEvent, blockStore, blockRectStore, commandBus);

    expect(focusedBlockHandler).not.toBeCalled();
  });

  it(`changes the block type on a click on a ${BlockType.CreateBlock} block, focuses the block, and adds a new ${BlockType.CreateBlock} block at the end`, () => {
    const cursorEvent = new CursorEvent('click', {
      position: new Vector(10, 70),
    });
    const focusBlockCommandHandler = jest.fn();
    const changeBlockTypeCommandHandler = jest.fn();
    const addBlockHandler = jest.fn();

    blockStore.add(BlockType.CreateBlock);
    blockRectStore.attach(3, blockRectMother.withSmallSize().underLast().create());
    commandBus.registerHandler(FocusBlockCommand, focusBlockCommandHandler);
    commandBus.registerHandler(ChangeBlockTypeCommand, changeBlockTypeCommandHandler);
    commandBus.registerHandler(AddBlockCommand, addBlockHandler);
    clickHandler(cursorEvent, blockStore, blockRectStore, commandBus);

    expect(focusBlockCommandHandler).toBeCalledTimes(1);
    expect(changeBlockTypeCommandHandler).toBeCalledTimes(1);
    expect(addBlockHandler).toBeCalledTimes(1);
    expect(addBlockHandler).toBeCalledWith(new AddBlockCommand(BlockType.CreateBlock));
  });
});
