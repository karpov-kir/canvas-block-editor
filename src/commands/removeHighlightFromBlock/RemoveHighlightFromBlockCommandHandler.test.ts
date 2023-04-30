import { BlockStore, BlockType } from '../../stores/BlockStore';
import { EventBus } from '../../utils/pubSub/EventBus';
import { RemoveHighlightFromBlockCommand } from './RemoveHighlightFromBlockCommand';
import {
  HighlightRemovedFromBlockEvent,
  RemoveHighlightFromBlockCommandHandler,
} from './RemoveHighlightFromBlockCommandHandler';

describe(RemoveHighlightFromBlockCommandHandler.name, () => {
  it(`removes highlight from the highlighted block on hover and emits ${HighlightRemovedFromBlockEvent.name}`, () => {
    const blockStore = new BlockStore();
    const eventBus = new EventBus();
    const highlightRemovedFromBlockEventHandler = jest.fn();

    eventBus.subscribe(HighlightRemovedFromBlockEvent, highlightRemovedFromBlockEventHandler);
    blockStore.add(BlockType.Text);
    blockStore.highlightedBlock = blockStore.blocks.get(1);
    new RemoveHighlightFromBlockCommandHandler(blockStore, eventBus).execute(new RemoveHighlightFromBlockCommand(1));

    expect(blockStore.highlightedBlock).toEqual(undefined);
    expect(highlightRemovedFromBlockEventHandler).toBeCalledWith(expect.any(HighlightRemovedFromBlockEvent));
  });
});
