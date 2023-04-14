import { BlockStore, BlockType } from '../../stores/BlockStore';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { ChangeBlockTypeCommand } from './ChangeBlockTypeCommand';
import { ChangeBlockTypeHandler } from './ChangeBlockTypeHandler';

describe(ChangeBlockTypeHandler, () => {
  it('changes a text block to h2 block', () => {
    const blockStore = new BlockStore();
    const command = new ChangeBlockTypeCommand(1, BlockType.H2);
    const handler = new ChangeBlockTypeHandler(blockStore);
    const expectedBlock = new BlockMother().withH2Type().create();

    blockStore.add(BlockType.Text);
    handler.execute(command);

    expect(blockStore.blocks).toEqual(new Map([[1, expectedBlock]]));
  });
});
