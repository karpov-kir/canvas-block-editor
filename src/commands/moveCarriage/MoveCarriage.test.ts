import { BlockStore } from '../../BlockStore';
import { ActiveBlockMother } from '../../testUtils/mothers/ActiveBlockMother';
import { MoveCarriageCommand } from './MoveCarriageCommand';
import { MoveCarriageHandler } from './MoveCarriageHandler';

describe(MoveCarriageHandler, () => {
  it('moves the carriage to a position', () => {
    const blockStore = new BlockStore();
    const handler = new MoveCarriageHandler(blockStore);
    const command = new MoveCarriageCommand(5);

    blockStore.add('text');
    blockStore.activeBlock = new ActiveBlockMother().build();

    handler.execute(command);

    expect(blockStore.activeBlock).toEqual(
      expect.objectContaining({
        carriagePosition: 5,
      }),
    );
  });
});
