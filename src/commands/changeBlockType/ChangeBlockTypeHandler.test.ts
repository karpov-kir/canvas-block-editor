import { BlockStore, BlockType } from '../../stores/BlockStore';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { ChangeBlockTypeCommand } from './ChangeBlockTypeCommand';
import { BlockTypeChangedEvent, ChangeBlockTypeHandler } from './ChangeBlockTypeHandler';

describe(ChangeBlockTypeHandler, () => {
  it(`changes a text block to h2 block and emits ${BlockTypeChangedEvent}`, () => {
    const blockStore = new BlockStore();
    const eventBus = new EventBus();
    const command = new ChangeBlockTypeCommand(1, BlockType.H2);
    const handler = new ChangeBlockTypeHandler(blockStore, eventBus);
    const expectedBlock = new BlockMother().withH2Type().create();
    const blockTypeChangedHandler = jest.fn();

    eventBus.subscribe(BlockTypeChangedEvent, blockTypeChangedHandler);
    blockStore.add(BlockType.Text);
    handler.execute(command);

    expect(blockStore.blocks).toEqual(new Map([[1, expectedBlock]]));
    expect(blockTypeChangedHandler).toBeCalledWith(new BlockTypeChangedEvent(expectedBlock, BlockType.Text));
  });
});
