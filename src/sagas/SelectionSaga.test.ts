import { BlockHighlightedEvent } from '../commands/highlightBlock/HighlightBlockCommandHandler';
import { RenderedEvent } from '../commands/render/RenderCommandHandler';
import { BlockType } from '../stores/BlockStore';
import { FakeSelectionManager } from '../testUtils/FakeSelectionManager';
import { BlockMother } from '../testUtils/mothers/BlockMother';
import { EventBus } from '../utils/pubSub/EventBus';
import { HighlightRemovedFromBlockEvent } from './../commands/removeHighlightFromBlock/RemoveHighlightFromBlockCommandHandler';
import { SelectionSaga } from './SelectionSaga';

describe(SelectionSaga.name, () => {
  let eventBus: EventBus;
  let fakeSelectionManager: FakeSelectionManager;
  let blockMother: BlockMother;

  beforeEach(() => {
    eventBus = new EventBus();
    fakeSelectionManager = new FakeSelectionManager();
    blockMother = new BlockMother();

    new SelectionSaga(eventBus, fakeSelectionManager);
  });

  it(`enables the selection manager on ${BlockHighlightedEvent.name}`, () => {
    const isSelectionManagerEnabledBefore = fakeSelectionManager.isEnabled;

    eventBus.publish(new BlockHighlightedEvent(blockMother.create()));

    expect(isSelectionManagerEnabledBefore).toBe(false);
    expect(fakeSelectionManager.isEnabled).toBe(true);
  });

  it(`does not enable the selection manager on ${BlockHighlightedEvent.name} with "${BlockType.CreateBlock}" block type`, () => {
    const isSelectionManagerEnabledBefore = fakeSelectionManager.isEnabled;

    eventBus.publish(new BlockHighlightedEvent(blockMother.withType(BlockType.CreateBlock).create()));

    expect(isSelectionManagerEnabledBefore).toBe(false);
    expect(fakeSelectionManager.isEnabled).toBe(false);
  });

  it(`disabled the selection manager on ${HighlightRemovedFromBlockEvent.name} and resets its position`, () => {
    fakeSelectionManager.enable(1);

    eventBus.publish(new HighlightRemovedFromBlockEvent(blockMother.create()));

    expect(fakeSelectionManager.isEnabled).toBe(false);
    expect(fakeSelectionManager.resetPosition).toBeCalled();
  });

  it(`updates the selection manager on ${RenderedEvent.name}`, () => {
    eventBus.publish(new RenderedEvent());

    expect(fakeSelectionManager.update).toBeCalled();
  });
});
