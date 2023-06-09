import { BlockStore, BlockType } from '../../stores/BlockStore';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { ChangeBlockTypeCommand } from './ChangeBlockTypeCommand';
import { BlockTypeChangedEvent, ChangeBlockTypeCommandHandler } from './ChangeBlockTypeCommandHandler';

describe(ChangeBlockTypeCommandHandler.name, () => {
  it(`changes the type of a block from "${BlockType.Text}" to "${BlockType.H2}" and emits the ${BlockTypeChangedEvent.name}`, () => {
    const blockStore = new BlockStore();
    const eventBus = new EventBus();
    const blockMother = new BlockMother();
    const blockTypeChangedEventHandler = jest.fn();

    eventBus.subscribe(BlockTypeChangedEvent, blockTypeChangedEventHandler);
    blockStore.add(BlockType.Text);
    new ChangeBlockTypeCommandHandler(blockStore, eventBus).execute(new ChangeBlockTypeCommand(1, BlockType.H2));

    expect(blockStore.blocks).toEqual(new Map([[1, blockMother.withType(BlockType.H2).create()]]));
    expect(blockTypeChangedEventHandler).toBeCalledWith(new BlockTypeChangedEvent(blockMother.last, BlockType.Text));
  });
});
