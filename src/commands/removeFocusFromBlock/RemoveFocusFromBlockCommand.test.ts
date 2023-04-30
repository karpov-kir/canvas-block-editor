import { BlockStore } from '../../stores/BlockStore';
import { ActiveBlockMother } from '../../testUtils/mothers/ActiveBlockMother';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { RemoveFocusFromBlockCommand } from './RemoveFocusFromBlockCommand';
import { FocusRemovedFromBlockEvent, RemoveFocusFromBlockCommandHandler } from './RemoveFocusFromBlockCommandHandler';

describe(RemoveFocusFromBlockCommandHandler.name, () => {
  it(`deactivates a block and emits the ${FocusRemovedFromBlockEvent.name}`, () => {
    const blockMother = new BlockMother();
    const activeBlockMother = new ActiveBlockMother();
    const blockStore = new BlockStore();
    const eventBus = new EventBus();
    const removeFocusFromBlockEventHandler = jest.fn();

    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.activeBlock = activeBlockMother.withBlock(blockMother.last).create();

    eventBus.subscribe(FocusRemovedFromBlockEvent, removeFocusFromBlockEventHandler);
    new RemoveFocusFromBlockCommandHandler(blockStore, eventBus).execute(new RemoveFocusFromBlockCommand(1));

    expect(blockStore.activeBlock).toBe(undefined);
    expect(removeFocusFromBlockEventHandler).toBeCalledWith(
      new FocusRemovedFromBlockEvent(activeBlockMother.last.block),
    );
  });
});
