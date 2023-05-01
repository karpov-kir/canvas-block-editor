import { BlockStore } from '../../stores/BlockStore';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { HighlightBlockCommand } from './HighlightBlockCommand';
import { BlockHighlightedEvent, HighlightBlockCommandHandler } from './HighlightBlockCommandHandler';

describe(HighlightBlockCommandHandler.name, () => {
  it(`highlights a block on hover and emits the ${BlockHighlightedEvent.name}`, () => {
    const blockStore = new BlockStore();
    const eventBus = new EventBus();
    const blockHighlightedEventHandler = jest.fn();
    const blockMother = new BlockMother();

    eventBus.subscribe(BlockHighlightedEvent, blockHighlightedEventHandler);
    blockStore.blocks.set(blockMother.create().id, blockMother.last);

    new HighlightBlockCommandHandler(blockStore, eventBus).execute(new HighlightBlockCommand(1));

    expect(blockStore.getHighlightedBlock(blockMother.last.id)).toEqual(blockStore.getById(blockMother.last.id));
    expect(blockStore.getHighlightedBlock(blockMother.last.id).isHighlighted).toBeTruthy();
    expect(blockHighlightedEventHandler).toBeCalledWith(expect.any(BlockHighlightedEvent));
  });
});
