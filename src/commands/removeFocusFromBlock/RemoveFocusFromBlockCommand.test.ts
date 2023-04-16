import { BlockStore, BlockType } from '../../stores/BlockStore';
import { ActiveBlockMother } from '../../testUtils/mothers/ActiveBlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { RemoveFocusFromBlockCommand } from './RemoveFocusFromBlockCommand';
import { FocusRemovedFromBlockEvent, RemoveFocusFromBlockCommandHandler } from './RemoveFocusFromBlockHandler';

describe(RemoveFocusFromBlockCommand, () => {
  it(`deactivates a block and emits the ${FocusRemovedFromBlockEvent}`, () => {
    const activeBlockMother = new ActiveBlockMother();
    const blockStore = new BlockStore();
    const command = new RemoveFocusFromBlockCommand(1);
    const eventBus = new EventBus();
    const handler = new RemoveFocusFromBlockCommandHandler(blockStore, eventBus);
    const removeFocusFromBlockCommandHandler = jest.fn();

    blockStore.activeBlock = activeBlockMother.create();

    eventBus.subscribe(FocusRemovedFromBlockEvent, removeFocusFromBlockCommandHandler);
    blockStore.add(BlockType.Text);
    handler.execute(command);

    expect(blockStore.activeBlock).toBe(undefined);
    expect(removeFocusFromBlockCommandHandler).toBeCalledWith(
      new FocusRemovedFromBlockEvent(activeBlockMother.last.block),
    );
  });
});
