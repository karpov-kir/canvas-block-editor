import { BlockStore } from '../../BlockStore';
import { RemoveHighlightFromBlockCommand } from './RemoveHighlightFromBlockCommand';
import { RemoveHighlightFromBlockHandler } from './RemoveHighlightFromBlockHandler';

describe(RemoveHighlightFromBlockHandler, () => {
  it('highlights a block on hover', () => {
    const blockStore = new BlockStore();
    const command = new RemoveHighlightFromBlockCommand(1);
    const handler = new RemoveHighlightFromBlockHandler(blockStore);

    blockStore.add('text');
    blockStore.highlightedBlock = blockStore.blocks.get(1);
    handler.execute(command);

    expect(blockStore.highlightedBlock).toEqual(undefined);
  });
});
