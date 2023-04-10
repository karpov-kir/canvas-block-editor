import { BlockStore } from '../../BlockStore';
import { HighlightBlockCommand } from './HighlightBlockCommand';
import { HighlightBlockHandler } from './HighlightBlockHandler';

describe(HighlightBlockCommand, () => {
  it('highlights a block on hover', () => {
    const blockStore = new BlockStore();
    const command = new HighlightBlockCommand(1);
    const handler = new HighlightBlockHandler(blockStore);

    blockStore.add('text');
    handler.handle(command);

    expect(blockStore.highlightedBlock).toEqual(blockStore.blocks.get(1));
  });
});
