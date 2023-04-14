import { BlockStore } from '../../stores/BlockStore';
import { ActiveBlockMother } from '../../testUtils/mothers/ActiveBlockMother';
import { InputCommand } from './InputCommand';
import { InputCommandHandler } from './InputCommandHandler';

describe(InputCommandHandler, () => {
  it('adds some input to the currently active block', () => {
    const blockStore = new BlockStore();
    const handler = new InputCommandHandler(blockStore);
    const command = new InputCommand('Hello world!');

    blockStore.add('text');
    blockStore.activeBlock = new ActiveBlockMother().create();

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
