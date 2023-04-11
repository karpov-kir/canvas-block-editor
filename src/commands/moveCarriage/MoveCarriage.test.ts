import { BlockStore } from '../../BlockStore';
import { ActiveBlockMother } from '../../testUtils/mothers/BlockMother';
import { MoveCarriageCommand } from './MoveCarriageCommand';
import { MoveCarriageHandler } from './MoveCarriageHandler';

describe(MoveCarriageHandler, () => {
  it('moves the carriage to a position', () => {
    const blockStore = new BlockStore();
    const handler = new MoveCarriageHandler(blockStore);
    const command = new MoveCarriageCommand(5);

    blockStore.add('text', { x: 0, y: 0 });
    blockStore.activeBlock = new ActiveBlockMother().createEmpty();

    handler.execute(command);

    expect(blockStore.activeBlock).toEqual(
      expect.objectContaining({
        carriagePosition: 5,
      }),
    );
  });
});
