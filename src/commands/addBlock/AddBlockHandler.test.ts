import { BlockStore, BlockType } from '../../stores/BlockStore';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { AddBlockCommand } from './AddBlockCommand';
import { AddBlockHandler, BlockAddedEvent } from './AddBlockHandler';

describe(AddBlockCommand.name, () => {
  it(`adds a text block and emits the ${BlockAddedEvent.name}`, () => {
    const blockStore = new BlockStore();
    const command = new AddBlockCommand(BlockType.Text);
    const eventBus = new EventBus();
    const handler = new AddBlockHandler(blockStore, eventBus);
    const expectedBlock = new BlockMother().create();
    const blockAddedHandler = jest.fn();

    eventBus.subscribe(BlockAddedEvent, blockAddedHandler);
    handler.execute(command);

    expect(blockStore.blocks).toEqual(new Map([[1, expectedBlock]]));
    expect(blockAddedHandler).toBeCalledWith(new BlockAddedEvent(expectedBlock));
  });
});
