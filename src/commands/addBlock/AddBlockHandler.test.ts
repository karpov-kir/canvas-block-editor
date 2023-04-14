import { BlockStore, BlockType } from '../../stores/BlockStore';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { AddBlockCommand } from './AddBlockCommand';
import { AddBlockHandler } from './AddBlockHandler';

describe('AddBlockCommand', () => {
  it('adds a text block', () => {
    const blockStore = new BlockStore();
    const command = new AddBlockCommand(BlockType.Text);
    const handler = new AddBlockHandler(blockStore);
    const expectedBlock = new BlockMother().create();

    handler.execute(command);

    expect(blockStore.blocks).toEqual(new Map([[1, expectedBlock]]));
  });
});
