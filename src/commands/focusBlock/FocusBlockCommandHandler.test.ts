import { BlockStore } from '../../stores/BlockStore';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { FocusBlockCommand } from './FocusBlockCommand';
import { BlockFocusedEvent, FocusBlockCommandHandler } from './FocusBlockCommandHandler';

describe(FocusBlockCommandHandler.name, () => {
  it(`focuses a block on ${FocusBlockCommand.name} and emits the ${BlockFocusedEvent.name}`, () => {
    const blockMother = new BlockMother();
    const blockStore = new BlockStore();
    const eventBus = new EventBus();
    const blockFocusedEventHandler = jest.fn();

    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.focusBlock(blockMother.last.id);
    eventBus.subscribe(BlockFocusedEvent, blockFocusedEventHandler);

    new FocusBlockCommandHandler(blockStore, eventBus).execute(new FocusBlockCommand(1));

    expect(blockStore.focusedBlocks.size).toEqual(1);
    expect(blockStore.getFocusedBlockById(blockMother.last.id)).toEqual(blockMother.last);
    expect(blockStore.getFocusedBlockById(blockMother.last.id).isFocused).toBeTruthy();
    expect(blockFocusedEventHandler).toBeCalledWith(new BlockFocusedEvent(blockMother.last));
  });
});
