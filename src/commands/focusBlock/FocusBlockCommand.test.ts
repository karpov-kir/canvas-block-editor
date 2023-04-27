import { BlockStore } from '../../stores/BlockStore';
import { ActiveBlockMother } from '../../testUtils/mothers/ActiveBlockMother';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { FocusBlockCommand } from './FocusBlockCommand';
import { BlockFocusedEvent, FocusBlockHandler } from './FocusBlockHandler';

describe(FocusBlockCommand.name, () => {
  it(`activates a block on focus and emits the ${BlockFocusedEvent.name}`, () => {
    const activeBlockMother = new ActiveBlockMother();
    const blockMother = new BlockMother();
    const blockStore = new BlockStore();
    const command = new FocusBlockCommand(1);
    const eventBus = new EventBus();
    const handler = new FocusBlockHandler(blockStore, eventBus);
    const blockFocusedHandler = jest.fn();

    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.activeBlock = activeBlockMother.withBlock(blockMother.last).create();

    eventBus.subscribe(BlockFocusedEvent, blockFocusedHandler);
    handler.execute(command);

    expect(blockStore.activeBlock).toEqual(activeBlockMother.last);
    expect(blockFocusedHandler).toBeCalledWith(new BlockFocusedEvent(activeBlockMother.last.block));
  });
});
