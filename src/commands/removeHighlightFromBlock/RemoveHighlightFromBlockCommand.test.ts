import { BlockStore, BlockType } from '../../stores/BlockStore';
import { EventBus } from '../../utils/pubSub/EventBus';
import { RemoveHighlightFromBlockCommand } from './RemoveHighlightFromBlockCommand';
import { HighlightRemovedFromBlockEvent, RemoveHighlightFromBlockHandler } from './RemoveHighlightFromBlockHandler';

describe(RemoveHighlightFromBlockHandler.name, () => {
  it(`removes highlight from the highlighted block on hover and emits ${HighlightRemovedFromBlockEvent.name}`, () => {
    const blockStore = new BlockStore();
    const eventBus = new EventBus();
    const highlightRemovedFromBlockHandler = jest.fn();

    eventBus.subscribe(HighlightRemovedFromBlockEvent, highlightRemovedFromBlockHandler);
    blockStore.add(BlockType.Text);
    blockStore.highlightedBlock = blockStore.blocks.get(1);
    new RemoveHighlightFromBlockHandler(blockStore, eventBus).execute(new RemoveHighlightFromBlockCommand(1));

    expect(blockStore.highlightedBlock).toEqual(undefined);
    expect(highlightRemovedFromBlockHandler).toBeCalledWith(expect.any(HighlightRemovedFromBlockEvent));
  });
});
