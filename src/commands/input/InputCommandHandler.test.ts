import { BlockStore } from '../../BlockStore';
import { ActiveBlockMother } from '../../testUtils/mothers/BlockMother';
import { InputCommand } from './InputCommand';
import { InputCommandHandler } from './InputCommandHandler';

describe(InputCommandHandler, () => {
  it('adds some input to the currently active block', () => {
    const blockStore = new BlockStore();
    const handler = new InputCommandHandler(blockStore);
    const command = new InputCommand('Hello world!');

    blockStore.add('text', { x: 0, y: 0 });
    blockStore.activeBlock = new ActiveBlockMother().createEmpty();

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
