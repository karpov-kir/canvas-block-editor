import { AddBlockCommand } from '../../../commands/addBlock/AddBlockCommand';
import { ChangeBlockTypeCommand } from '../../../commands/changeBlockType/ChangeBlockTypeCommand';
import { FocusBlockCommand } from '../../../commands/focusBlock/FocusBlockCommand';
import { RemoveFocusFromBlockCommand } from '../../../commands/removeFocusFromBlock/RemoveFocusFromBlockCommand';
import { BlockRectStore } from '../../../stores/BlockRectStore';
import { BlockStore, BlockType } from '../../../stores/BlockStore';
import { CommandHandlerStub } from '../../../testUtils/CommandHandlerStub';
import { ActiveBlockMother } from '../../../testUtils/mothers/ActiveBlockMother';
import { BlockRectMother } from '../../../testUtils/mothers/BlockRectMother';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
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

  it(`emits the ${FocusBlockCommand.name} on a click on a block`, () => {
    const clickEvent = new MouseEvent('click', {
      clientX: 10,
      clientY: 10,
    });
    const focusedBlockHandler = new CommandHandlerStub();

    commandBus.subscribe(FocusBlockCommand, focusedBlockHandler);
    // Clicking on a not active block should not emit the command
    clickHandler(clickEvent, blockStore, blockRectStore, commandBus);

    blockStore.activeBlock = activeBlockMother.create();

    clickHandler(clickEvent, blockStore, blockRectStore, commandBus);

    expect(focusedBlockHandler.execute).toBeCalledTimes(1);
  });

  it(`does not emit the ${FocusBlockCommand.name} if the clicked block is already active`, () => {
    const focusedBlockHandler = new CommandHandlerStub();

    commandBus.subscribe(FocusBlockCommand, focusedBlockHandler);
    blockStore.activeBlock = activeBlockMother.create();

    clickHandler(
      new MouseEvent('click', {
        clientX: 10,
        clientY: 10,
      }),
      blockStore,
      blockRectStore,
      commandBus,
    );

    expect(focusedBlockHandler.execute).not.toBeCalled();
  });

  it(`changes the block type on a click on a ${BlockType.CreateBlock} block, focuses the block, and adds a new ${BlockType.CreateBlock} block at the end`, () => {
    const focusBlockCommandHandler = new CommandHandlerStub();
    const changeBlockTypeCommandHandler = new CommandHandlerStub();
    const addBlockHandler = new CommandHandlerStub();

    blockStore.add(BlockType.CreateBlock);
    blockRectStore.attach(3, blockRectMother.withSmallSize().underLast().create());
    commandBus.subscribe(FocusBlockCommand, focusBlockCommandHandler);
    commandBus.subscribe(ChangeBlockTypeCommand, changeBlockTypeCommandHandler);
    commandBus.subscribe(AddBlockCommand, addBlockHandler);
    clickHandler(
      new MouseEvent('click', {
        clientX: 10,
        clientY: 70,
      }),
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
    const clickEvent = new MouseEvent('click', {
      clientX: -100,
      clientY: -100,
    });
    const removeFocusFromBlockHandler = new CommandHandlerStub();

    blockStore.activeBlock = activeBlockMother.create();

    commandBus.subscribe(RemoveFocusFromBlockCommand, removeFocusFromBlockHandler);
    clickHandler(clickEvent, blockStore, blockRectStore, commandBus);

    blockStore.activeBlock = undefined;

    clickHandler(clickEvent, blockStore, blockRectStore, commandBus);

    expect(removeFocusFromBlockHandler.execute).toBeCalledTimes(1);
  });
});
