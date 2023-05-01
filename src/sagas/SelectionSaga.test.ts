import { BlockFocusedEvent } from '../commands/focusBlock/FocusBlockCommandHandler';
import { FocusRemovedFromBlockEvent } from '../commands/removeFocusFromBlock/RemoveFocusFromBlockCommandHandler';
import { RenderedEvent } from '../commands/render/RenderCommandHandler';
import { BlockMother } from '../testUtils/mothers/BlockMother';
import { StubSelectionManager } from '../testUtils/StubSelectionManager';
import { EventBus } from '../utils/pubSub/EventBus';
import { SelectionManager, SelectionSaga } from './SelectionSaga';

describe(SelectionSaga.name, () => {
  let eventBus: EventBus;
  let stubSelectionManager: SelectionManager;
  let blockMother: BlockMother;

  beforeEach(() => {
    eventBus = new EventBus();
    stubSelectionManager = new StubSelectionManager();
    blockMother = new BlockMother();

    new SelectionSaga(eventBus, stubSelectionManager);
  });

  it(`enables the selection manager on ${BlockFocusedEvent.name}`, () => {
    const isSelectionManagerEnabledBefore = stubSelectionManager.isEnabled;

    eventBus.publish(new BlockFocusedEvent(blockMother.create()));

    expect(isSelectionManagerEnabledBefore).toBe(false);
    expect(stubSelectionManager.isEnabled).toBe(true);
  });

  it(`disabled the selection manager on ${FocusRemovedFromBlockEvent.name} and resets its position`, () => {
    stubSelectionManager.enable(1);

    eventBus.publish(new FocusRemovedFromBlockEvent(blockMother.create()));

    expect(stubSelectionManager.isEnabled).toBe(false);
    expect(stubSelectionManager.resetPosition).toBeCalled();
  });

  it(`updates the selection manager on ${RenderedEvent.name}`, () => {
    eventBus.publish(new RenderedEvent());

    expect(stubSelectionManager.update).toBeCalled();
  });
});
