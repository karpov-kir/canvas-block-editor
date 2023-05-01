import { BlockStore } from '../../stores/BlockStore';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { RemoveHighlightFromBlockCommand } from './RemoveHighlightFromBlockCommand';
import {
  HighlightRemovedFromBlockEvent,
  RemoveHighlightFromBlockCommandHandler,
} from './RemoveHighlightFromBlockCommandHandler';

describe(RemoveHighlightFromBlockCommandHandler.name, () => {
  it(`removes highlight from the highlighted block on hover and emits ${HighlightRemovedFromBlockEvent.name}`, () => {
    const blockStore = new BlockStore();
    const eventBus = new EventBus();
    const blockMother = new BlockMother();
    const highlightRemovedFromBlockEventHandler = jest.fn();

    eventBus.subscribe(HighlightRemovedFromBlockEvent, highlightRemovedFromBlockEventHandler);
    blockStore.blocks.set(blockMother.create().id, blockMother.last);
    blockStore.highlightBlock(blockMother.last.id);
    new RemoveHighlightFromBlockCommandHandler(blockStore, eventBus).execute(new RemoveHighlightFromBlockCommand(1));

    expect(blockStore.highlightedBlocks.size).toEqual(0);
    expect(blockStore.getById(blockMother.last.id).isHighlighted).toBeFalsy();
    expect(highlightRemovedFromBlockEventHandler).toBeCalledWith(expect.any(HighlightRemovedFromBlockEvent));
  });
});
