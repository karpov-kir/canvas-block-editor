import { BlockStore } from '../../stores/BlockStore';
import { ActiveBlockMother } from '../../testUtils/mothers/ActiveBlockMother';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { SelectCommand, Selection } from './SelectCommand';
import { SelectedEvent, SelectHandler } from './SelectHandler';

describe(SelectCommand.name, () => {
  let blockStore: BlockStore;
  let eventBus: EventBus;
  let handler: SelectHandler;
  let activeBlockMother: ActiveBlockMother;
  let blockMother: BlockMother;

  beforeEach(() => {
    blockStore = new BlockStore();
    eventBus = new EventBus();
    handler = new SelectHandler(blockStore, eventBus);
    activeBlockMother = new ActiveBlockMother();
    blockMother = new BlockMother();
  });

  it(`selects some content and emits the ${SelectedEvent.name}`, () => {
    const selectedHandler = jest.fn();

    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.activeBlock = activeBlockMother.withBlock(blockMother.last).create();

    eventBus.subscribe(SelectedEvent, selectedHandler);
    handler.execute(new SelectCommand(new Selection(0, 5)));

    expect(blockStore.activeBlock.selection).toEqual(new Selection(0, 5));
    expect(selectedHandler).toBeCalledWith(new SelectedEvent(blockStore.activeBlock.block, new Selection(0, 5)));
  });

  it(`throws an error if the selection is out of range`, () => {
    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.activeBlock = activeBlockMother.withBlock(blockMother.last).create();

    expect(() => handler.execute(new SelectCommand(new Selection(0, Number.MAX_SAFE_INTEGER)))).toThrow(
      expect.any(RangeError),
    );
  });
});
