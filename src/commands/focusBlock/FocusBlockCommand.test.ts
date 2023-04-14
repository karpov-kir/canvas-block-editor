import { BlockStore } from '../../stores/BlockStore';
import { ActiveBlockMother } from '../../testUtils/mothers/ActiveBlockMother';
import { FocusBlockCommand } from './FocusBlockCommand';
import { FocusBlockHandler } from './FocusBlockHandler';

describe(FocusBlockCommand, () => {
  it('activates a block on focus', () => {
    const blockStore = new BlockStore();
    const command = new FocusBlockCommand(1);
    const handler = new FocusBlockHandler(blockStore);

    blockStore.add('text');
    handler.execute(command);

    expect(blockStore.activeBlock).toEqual(new ActiveBlockMother().create());
  });
});
