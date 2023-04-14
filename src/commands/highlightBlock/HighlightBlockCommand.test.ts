import { BlockStore, BlockType } from '../../stores/BlockStore';
import { HighlightBlockCommand } from './HighlightBlockCommand';
import { HighlightBlockHandler } from './HighlightBlockHandler';

describe(HighlightBlockCommand, () => {
  it('highlights a block on hover', () => {
    const blockStore = new BlockStore();
    const command = new HighlightBlockCommand(1);
    const handler = new HighlightBlockHandler(blockStore);

    blockStore.add(BlockType.Text);
    handler.execute(command);

    expect(blockStore.highlightedBlock).toEqual(blockStore.blocks.get(1));
  });
});
