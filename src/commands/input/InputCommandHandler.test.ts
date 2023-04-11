import { Block, BlockStore } from '../../BlockStore';
import { InputCommand } from './InputCommand';
import { InputCommandHandler } from './InputCommandHandler';

describe(InputCommandHandler, () => {
  it('adds a character to the currently active block', () => {
    const blockStore = new BlockStore();
    const handler = new InputCommandHandler(blockStore);
    const command = new InputCommand('Hello world!');

    blockStore.add('text', { x: 0, y: 0 });
    blockStore.activeBlock = {
      block: blockStore.blocks.get(1) as Block,
      carriagePosition: 0,
    };

    handler.execute(command);

    expect(blockStore.activeBlock).toEqual(
      expect.objectContaining({
        block: expect.objectContaining({
          content: 'Hello world!',
        }),
      }),
    );
  });
});
