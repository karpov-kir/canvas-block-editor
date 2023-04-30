import { BlockStore, BlockType } from '../../stores/BlockStore';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { AddBlockCommand } from './AddBlockCommand';
import { AddBlockCommandHandler, BlockAddedEvent } from './AddBlockCommandHandler';

describe(AddBlockCommandHandler.name, () => {
  it(`adds a text block and emits the ${BlockAddedEvent.name}`, () => {
    const blockStore = new BlockStore();
    const eventBus = new EventBus();
    const blockMother = new BlockMother();
    const blockAddedEventHandler = jest.fn();

    eventBus.subscribe(BlockAddedEvent, blockAddedEventHandler);
    new AddBlockCommandHandler(blockStore, eventBus).execute(new AddBlockCommand(BlockType.Text));

    expect(blockStore.blocks).toEqual(new Map([[1, blockMother.create()]]));
    expect(blockAddedEventHandler).toBeCalledWith(new BlockAddedEvent(blockMother.last));
  });
});
