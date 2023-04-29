import { BlockStore, BlockType } from '../../stores/BlockStore';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { ChangeBlockTypeCommand } from './ChangeBlockTypeCommand';
import { BlockTypeChangedEvent, ChangeBlockTypeHandler } from './ChangeBlockTypeHandler';

describe(ChangeBlockTypeHandler.name, () => {
  it(`changes the type of a block from "${BlockType.Text}" to "${BlockType.H2}" and emits the ${BlockTypeChangedEvent.name}`, () => {
    const blockStore = new BlockStore();
    const eventBus = new EventBus();
    const blockMother = new BlockMother();
    const blockTypeChangedHandler = jest.fn();

    eventBus.subscribe(BlockTypeChangedEvent, blockTypeChangedHandler);
    blockStore.add(BlockType.Text);
    new ChangeBlockTypeHandler(blockStore, eventBus).execute(new ChangeBlockTypeCommand(1, BlockType.H2));

    expect(blockStore.blocks).toEqual(new Map([[1, blockMother.withType(BlockType.H2).create()]]));
    expect(blockTypeChangedHandler).toBeCalledWith(new BlockTypeChangedEvent(blockMother.last, BlockType.Text));
  });
});
