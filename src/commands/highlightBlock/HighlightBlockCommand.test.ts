import { BlockStore, BlockType } from '../../stores/BlockStore';
import { EventBus } from '../../utils/pubSub/EventBus';
import { HighlightBlockCommand } from './HighlightBlockCommand';
import { BlockHighlightedEvent, HighlightBlockHandler } from './HighlightBlockHandler';

describe(HighlightBlockCommand.name, () => {
  it(`highlights a block on hover and emits the ${BlockHighlightedEvent.name}`, () => {
    const blockStore = new BlockStore();
    const eventBus = new EventBus();
    const blockHighlightedHandler = jest.fn();

    eventBus.subscribe(BlockHighlightedEvent, blockHighlightedHandler);
    blockStore.add(BlockType.Text);
    new HighlightBlockHandler(blockStore, eventBus).execute(new HighlightBlockCommand(1));

    expect(blockStore.highlightedBlock).toEqual(blockStore.blocks.get(1));
    expect(blockHighlightedHandler).toBeCalledWith(expect.any(BlockHighlightedEvent));
  });
});
