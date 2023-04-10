import { Block, BlockStore } from '../../BlockStore';
import { MoveCarriageCommand } from './MoveCarriageCommand';
import { MoveCarriageHandler } from './MoveCarriageHandler';

describe(MoveCarriageHandler, () => {
  it('moves the carriage to a position', () => {
    const blockStore = new BlockStore();
    const handler = new MoveCarriageHandler(blockStore);
    const command = new MoveCarriageCommand(5);

    blockStore.add('text');
    blockStore.activeBlock = {
      block: blockStore.blocks.get(1) as Block,
      carriagePosition: 0,
    };

    handler.handle(command);

    expect(blockStore.activeBlock).toEqual({
      block: {
        id: 1,
        type: 'text',
        content: '',
      },
      carriagePosition: 5,
    });
  });
});
