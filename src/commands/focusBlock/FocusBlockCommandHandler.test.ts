import { BlockStore } from '../../stores/BlockStore';
import { ActiveBlockMother } from '../../testUtils/mothers/ActiveBlockMother';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { FocusBlockCommand } from './FocusBlockCommand';
import { BlockFocusedEvent, FocusBlockCommandHandler } from './FocusBlockCommandHandler';

describe(FocusBlockCommandHandler.name, () => {
  it(`activates a block on focus and emits the ${BlockFocusedEvent.name}`, () => {
    const activeBlockMother = new ActiveBlockMother();
    const blockMother = new BlockMother();
    const blockStore = new BlockStore();
    const eventBus = new EventBus();
    const blockFocusedEventHandler = jest.fn();

    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.activeBlock = activeBlockMother.withBlock(blockMother.last).create();

    eventBus.subscribe(BlockFocusedEvent, blockFocusedEventHandler);
    new FocusBlockCommandHandler(blockStore, eventBus).execute(new FocusBlockCommand(1));

    expect(blockStore.activeBlock).toEqual(activeBlockMother.last);
    expect(blockFocusedEventHandler).toBeCalledWith(new BlockFocusedEvent(activeBlockMother.last.block));
  });
});
