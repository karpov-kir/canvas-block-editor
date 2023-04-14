import { BlockStore, BlockType } from '../../stores/BlockStore';
import { EventBus } from '../../utils/pubSub/EventBus';
import { HighlightBlockCommand } from './HighlightBlockCommand';
import { BlockHighlightedEvent, HighlightBlockHandler } from './HighlightBlockHandler';

describe(HighlightBlockCommand, () => {
  it(`highlights a block on hover and emits the ${BlockHighlightedEvent}`, () => {
    const blockStore = new BlockStore();
    const command = new HighlightBlockCommand(1);
    const eventBus = new EventBus();
    const handler = new HighlightBlockHandler(blockStore, eventBus);
    const blockHighlightedHandler = jest.fn();

    eventBus.subscribe(BlockHighlightedEvent, blockHighlightedHandler);
    blockStore.add(BlockType.Text);
    handler.execute(command);

    expect(blockStore.highlightedBlock).toEqual(blockStore.blocks.get(1));
    expect(blockHighlightedHandler).toBeCalledWith(expect.any(BlockHighlightedEvent));
  });
});
