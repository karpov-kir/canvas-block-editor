import { BlockStore } from '../../stores/BlockStore';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { SelectInBlockCommand, Selection } from './SelectInBlockCommand';
import { SelectedInBlockEvent, SelectInBlockCommandHandler } from './SelectInBlockCommandHandler';

describe(SelectInBlockCommandHandler.name, () => {
  let blockStore: BlockStore;
  let eventBus: EventBus;
  let handler: SelectInBlockCommandHandler;
  let blockMother: BlockMother;

  beforeEach(() => {
    blockStore = new BlockStore();
    eventBus = new EventBus();
    handler = new SelectInBlockCommandHandler(blockStore, eventBus);
    blockMother = new BlockMother();
  });

  it(`selects some content and emits the ${SelectedInBlockEvent.name}`, () => {
    const SelectedInBlockEventHandler = jest.fn();

    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    eventBus.subscribe(SelectedInBlockEvent, SelectedInBlockEventHandler);

    handler.execute(new SelectInBlockCommand(blockMother.last.id, new Selection(0, 5)));

    expect(blockStore.getById(blockMother.last.id).selection).toEqual(new Selection(0, 5));
    expect(blockStore.blocksWithSelection.get(blockMother.last.id)).toEqual(blockMother.last);
    expect(SelectedInBlockEventHandler).toBeCalledWith(new SelectedInBlockEvent(blockMother.last, new Selection(0, 5)));
  });

  it(`throws an error if the selection is out of range`, () => {
    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);

    expect(() =>
      handler.execute(new SelectInBlockCommand(blockMother.last.id, new Selection(0, Number.MAX_SAFE_INTEGER))),
    ).toThrow(expect.any(RangeError));
  });
});
