import { BlockStore, BlockType } from '../../stores/BlockStore';
import { ActiveBlockMother } from '../../testUtils/mothers/ActiveBlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { FocusBlockCommand } from './FocusBlockCommand';
import { BlockFocusedEvent, FocusBlockHandler } from './FocusBlockHandler';

describe(FocusBlockCommand, () => {
  it(`activates a block on focus and emits the ${BlockFocusedEvent}`, () => {
    const activeBlockMother = new ActiveBlockMother();
    const blockStore = new BlockStore();
    const command = new FocusBlockCommand(1);
    const eventBus = new EventBus();
    const handler = new FocusBlockHandler(blockStore, eventBus);
    const blockFocusedHandler = jest.fn();

    eventBus.subscribe(BlockFocusedEvent, blockFocusedHandler);
    blockStore.add(BlockType.Text);
    handler.execute(command);

    expect(blockStore.activeBlock).toEqual(activeBlockMother.create());
    expect(blockFocusedHandler).toBeCalledWith(new BlockFocusedEvent(activeBlockMother.last.block));
  });
});
