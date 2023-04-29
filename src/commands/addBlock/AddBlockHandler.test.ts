import { BlockStore, BlockType } from '../../stores/BlockStore';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { AddBlockCommand } from './AddBlockCommand';
import { AddBlockHandler, BlockAddedEvent } from './AddBlockHandler';

describe(AddBlockCommand.name, () => {
  it(`adds a text block and emits the ${BlockAddedEvent.name}`, () => {
    const blockStore = new BlockStore();
    const eventBus = new EventBus();
    const blockMother = new BlockMother();
    const blockAddedHandler = jest.fn();

    eventBus.subscribe(BlockAddedEvent, blockAddedHandler);
    new AddBlockHandler(blockStore, eventBus).execute(new AddBlockCommand(BlockType.Text));

    expect(blockStore.blocks).toEqual(new Map([[1, blockMother.create()]]));
    expect(blockAddedHandler).toBeCalledWith(new BlockAddedEvent(blockMother.last));
  });
});
