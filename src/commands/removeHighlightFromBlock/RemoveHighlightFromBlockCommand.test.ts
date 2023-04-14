import { BlockStore, BlockType } from '../../stores/BlockStore';
import { EventBus } from '../../utils/pubSub/EventBus';
import { RemoveHighlightFromBlockCommand } from './RemoveHighlightFromBlockCommand';
import { HighlightRemovedFromBlockEvent, RemoveHighlightFromBlockHandler } from './RemoveHighlightFromBlockHandler';

describe(RemoveHighlightFromBlockHandler, () => {
  it(`highlights a block on hover and emits ${HighlightRemovedFromBlockEvent}`, () => {
    const blockStore = new BlockStore();
    const eventBus = new EventBus();
    const command = new RemoveHighlightFromBlockCommand(1);
    const handler = new RemoveHighlightFromBlockHandler(blockStore, eventBus);
    const highlightRemovedFromBlockHandler = jest.fn();

    eventBus.subscribe(HighlightRemovedFromBlockEvent, highlightRemovedFromBlockHandler);
    blockStore.add(BlockType.Text);
    blockStore.highlightedBlock = blockStore.blocks.get(1);
    handler.execute(command);

    expect(blockStore.highlightedBlock).toEqual(undefined);
    expect(highlightRemovedFromBlockHandler).toBeCalledWith(expect.any(HighlightRemovedFromBlockEvent));
  });
});
