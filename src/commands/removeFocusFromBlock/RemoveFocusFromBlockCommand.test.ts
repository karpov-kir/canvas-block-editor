import { BlockStore } from '../../stores/BlockStore';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { RemoveFocusFromBlockCommand } from './RemoveFocusFromBlockCommand';
import { FocusRemovedFromBlockEvent, RemoveFocusFromBlockCommandHandler } from './RemoveFocusFromBlockCommandHandler';

describe(RemoveFocusFromBlockCommandHandler.name, () => {
  it(`removes focus from a block and emits the ${FocusRemovedFromBlockEvent.name}`, () => {
    const blockMother = new BlockMother();
    const blockStore = new BlockStore();
    const eventBus = new EventBus();
    const removeFocusFromBlockEventHandler = jest.fn();

    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.focusBlock(blockMother.last.id);
    eventBus.subscribe(FocusRemovedFromBlockEvent, removeFocusFromBlockEventHandler);

    new RemoveFocusFromBlockCommandHandler(blockStore, eventBus).execute(new RemoveFocusFromBlockCommand(1));

    expect(blockStore.focusedBlocks.size).toBe(0);
    expect(removeFocusFromBlockEventHandler).toBeCalledWith(new FocusRemovedFromBlockEvent(blockMother.last));
  });
});
