import { BlockStore } from '../../stores/BlockStore';
import { ActiveBlockMother } from '../../testUtils/mothers/ActiveBlockMother';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { RemoveFocusFromBlockCommand } from './RemoveFocusFromBlockCommand';
import { FocusRemovedFromBlockEvent, RemoveFocusFromBlockCommandHandler } from './RemoveFocusFromBlockHandler';

describe(RemoveFocusFromBlockCommand.name, () => {
  it(`deactivates a block and emits the ${FocusRemovedFromBlockEvent.name}`, () => {
    const blockMother = new BlockMother();
    const activeBlockMother = new ActiveBlockMother();
    const blockStore = new BlockStore();
    const eventBus = new EventBus();
    const removeFocusFromBlockCommandHandler = jest.fn();

    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.activeBlock = activeBlockMother.withBlock(blockMother.last).create();

    eventBus.subscribe(FocusRemovedFromBlockEvent, removeFocusFromBlockCommandHandler);
    new RemoveFocusFromBlockCommandHandler(blockStore, eventBus).execute(new RemoveFocusFromBlockCommand(1));

    expect(blockStore.activeBlock).toBe(undefined);
    expect(removeFocusFromBlockCommandHandler).toBeCalledWith(
      new FocusRemovedFromBlockEvent(activeBlockMother.last.block),
    );
  });
});
