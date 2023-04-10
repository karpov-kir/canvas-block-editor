import { BlockStore } from '../../BlockStore';
import { AddBlockCommand } from './AddBlockCommand';
import { AddBlockHandler } from './AddBlockHandler';

describe('AddBlockCommand', () => {
  it('adds a text block', () => {
    const blockType = 'text';
    const blockStore = new BlockStore();
    const command = new AddBlockCommand(blockType);
    const handler = new AddBlockHandler(blockStore);

    handler.execute(command);

    expect(blockStore.blocks).toEqual(
      new Map([
        [
          1,
          {
            type: 'text',
            content: '',
            id: 1,
          },
        ],
      ]),
    );
  });
});
