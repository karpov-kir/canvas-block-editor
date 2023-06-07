import { BlockHighlightedEvent } from '../commands/highlightBlock/HighlightBlockCommandHandler';
import { RenderedEvent } from '../commands/render/RenderCommandHandler';
import { BlockType } from '../stores/BlockStore';
import { BlockMother } from '../testUtils/mothers/BlockMother';
import { StubSelectionManager } from '../testUtils/StubSelectionManager';
import { EventBus } from '../utils/pubSub/EventBus';
import { HighlightRemovedFromBlockEvent } from './../commands/removeHighlightFromBlock/RemoveHighlightFromBlockCommandHandler';
import { SelectionSaga } from './SelectionSaga';

describe(SelectionSaga.name, () => {
  let eventBus: EventBus;
  let stubSelectionManager: StubSelectionManager;
  let blockMother: BlockMother;

  beforeEach(() => {
    eventBus = new EventBus();
    stubSelectionManager = new StubSelectionManager();
    blockMother = new BlockMother();

    new SelectionSaga(eventBus, stubSelectionManager);
  });

  it(`enables the selection manager on ${BlockHighlightedEvent.name}`, () => {
    const isSelectionManagerEnabledBefore = stubSelectionManager.isEnabled;

    eventBus.publish(new BlockHighlightedEvent(blockMother.create()));

    expect(isSelectionManagerEnabledBefore).toBe(false);
    expect(stubSelectionManager.isEnabled).toBe(true);
  });

  it(`does not enable the selection manager on ${BlockHighlightedEvent.name} with "${BlockType.CreateBlock}" block type`, () => {
    const isSelectionManagerEnabledBefore = stubSelectionManager.isEnabled;

    eventBus.publish(new BlockHighlightedEvent(blockMother.withType(BlockType.CreateBlock).create()));

    expect(isSelectionManagerEnabledBefore).toBe(false);
    expect(stubSelectionManager.isEnabled).toBe(false);
  });

  it(`disabled the selection manager on ${HighlightRemovedFromBlockEvent.name} and resets its position`, () => {
    stubSelectionManager.enable(1);

    eventBus.publish(new HighlightRemovedFromBlockEvent(blockMother.create()));

    expect(stubSelectionManager.isEnabled).toBe(false);
    expect(stubSelectionManager.resetPosition).toBeCalled();
  });

  it(`updates the selection manager on ${RenderedEvent.name}`, () => {
    eventBus.publish(new RenderedEvent());

    expect(stubSelectionManager.update).toBeCalled();
  });
});
