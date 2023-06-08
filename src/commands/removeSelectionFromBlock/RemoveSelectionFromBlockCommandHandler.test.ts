import { BlockStore } from '../../stores/BlockStore';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { Selection } from '../selectInBlock/SelectInBlockCommand';
import { RemoveSelectionFromBlockCommand } from './RemoveSelectionFromBlockCommand';
import {
  RemoveSelectionFromBlockCommandHandler,
  SelectionRemovedFromBlockEvent,
} from './RemoveSelectionFromBlockCommandHandler';

describe(RemoveSelectionFromBlockCommandHandler.name, () => {
  let blockStore: BlockStore;
  let eventBus: EventBus;
  let handler: RemoveSelectionFromBlockCommandHandler;
  let blockMother: BlockMother;

  beforeEach(() => {
    blockStore = new BlockStore();
    eventBus = new EventBus();
    handler = new RemoveSelectionFromBlockCommandHandler(blockStore, eventBus);
    blockMother = new BlockMother();
  });

  it(`unselects some content and emits the ${SelectionRemovedFromBlockEvent.name}`, () => {
    const SelectionRemovedFromBlockEventHandler = jest.fn();

    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.setSelection(blockMother.last.id, new Selection(0, 5));
    eventBus.subscribe(SelectionRemovedFromBlockEvent, SelectionRemovedFromBlockEventHandler);

    handler.execute(new RemoveSelectionFromBlockCommand(blockMother.last.id));

    expect(blockStore.getById(blockMother.last.id).selection).toBe(undefined);
    expect(SelectionRemovedFromBlockEventHandler).toBeCalledWith(new SelectionRemovedFromBlockEvent(blockMother.last));
  });
});
