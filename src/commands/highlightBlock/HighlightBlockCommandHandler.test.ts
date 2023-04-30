import { BlockStore, BlockType } from '../../stores/BlockStore';
import { EventBus } from '../../utils/pubSub/EventBus';
import { HighlightBlockCommand } from './HighlightBlockCommand';
import { BlockHighlightedEvent, HighlightBlockCommandHandler } from './HighlightBlockCommandHandler';

describe(HighlightBlockCommandHandler.name, () => {
  it(`highlights a block on hover and emits the ${BlockHighlightedEvent.name}`, () => {
    const blockStore = new BlockStore();
    const eventBus = new EventBus();
    const blockHighlightedEventHandler = jest.fn();

    eventBus.subscribe(BlockHighlightedEvent, blockHighlightedEventHandler);
    blockStore.add(BlockType.Text);
    new HighlightBlockCommandHandler(blockStore, eventBus).execute(new HighlightBlockCommand(1));

    expect(blockStore.highlightedBlock).toEqual(blockStore.blocks.get(1));
    expect(blockHighlightedEventHandler).toBeCalledWith(expect.any(BlockHighlightedEvent));
  });
});
