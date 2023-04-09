import { AddBlockCommand } from './AddBlockCommand';
import { AddBlockHandler } from './AddBlockHandler';
import { BlockStore } from './BlockStore';

describe('AddBlockCommand', () => {
  it('adds a text block', () => {
    const blockType = 'text';
    const blockStore = new BlockStore();
    const command = new AddBlockCommand(blockType);
    const handler = new AddBlockHandler(blockStore);

    handler.handle(command);

    expect(blockStore.blocks).toEqual([
      {
        type: 'text',
        content: '',
      },
    ]);
  });
});
