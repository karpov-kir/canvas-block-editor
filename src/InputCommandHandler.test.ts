import { BlockStore } from './BlockStore';
import { InputCommand } from './InputCommand';
import { InputCommandHandler } from './InputCommandHandler';

describe(InputCommandHandler, () => {
  it('adds a character to the currently active block', () => {
    const blockStore = new BlockStore();
    const handler = new InputCommandHandler(blockStore);
    const command = new InputCommand('Hello world!');

    blockStore.add('text');
    blockStore.activeBlock = blockStore.blocks[0];

    handler.handle(command);

    expect(blockStore.activeBlock).toEqual({
      id: 1,
      type: 'text',
      content: 'Hello world!',
    });
  });
});
