import { BlockStore } from '../../stores/BlockStore';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { SelectCommand, Selection } from './SelectCommand';
import { SelectCommandHandler, SelectedEvent } from './SelectCommandHandler';

describe(SelectCommandHandler.name, () => {
  let blockStore: BlockStore;
  let eventBus: EventBus;
  let handler: SelectCommandHandler;
  let blockMother: BlockMother;

  beforeEach(() => {
    blockStore = new BlockStore();
    eventBus = new EventBus();
    handler = new SelectCommandHandler(blockStore, eventBus);
    blockMother = new BlockMother();
  });

  it(`selects some content and emits the ${SelectedEvent.name}`, () => {
    const selectedEventHandler = jest.fn();

    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.focusBlock(blockMother.last.id);
    eventBus.subscribe(SelectedEvent, selectedEventHandler);

    handler.execute(new SelectCommand(blockMother.last.id, new Selection(0, 5)));

    expect(blockStore.getById(blockMother.last.id).selection).toEqual(new Selection(0, 5));
    expect(selectedEventHandler).toBeCalledWith(new SelectedEvent(blockMother.last, new Selection(0, 5)));
  });

  it(`throws an error if the selection is out of range`, () => {
    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);

    blockStore.focusBlock(blockMother.last.id);

    expect(() =>
      handler.execute(new SelectCommand(blockMother.last.id, new Selection(0, Number.MAX_SAFE_INTEGER))),
    ).toThrow(expect.any(RangeError));
  });
});
