import { BlockStore } from '../../stores/BlockStore';
import { ActiveBlockMother } from '../../testUtils/mothers/ActiveBlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { SelectCommand } from './SelectCommand';
import { SelectedEvent, SelectHandler } from './SelectHandler';

describe('SelectCommand', () => {
  let blockStore: BlockStore;
  let eventBus: EventBus;
  let handler: SelectHandler;
  let activeBlockMother: ActiveBlockMother;

  beforeEach(() => {
    blockStore = new BlockStore();
    eventBus = new EventBus();
    handler = new SelectHandler(blockStore, eventBus);
    activeBlockMother = new ActiveBlockMother();
  });

  it(`selects some content and emits the ${SelectedEvent}`, () => {
    const command = new SelectCommand([0, 5]);
    const selectedHandler = jest.fn();

    eventBus.subscribe(SelectedEvent, selectedHandler);
    blockStore.activeBlock = activeBlockMother.withContent().create();
    handler.execute(command);

    expect(blockStore.activeBlock.selection).toEqual([0, 5]);
    expect(selectedHandler).toBeCalledWith(new SelectedEvent(blockStore.activeBlock.block, [0, 5]));
  });

  it(`throws an error if a selection is out of range`, () => {
    const command = new SelectCommand([0, Number.MAX_SAFE_INTEGER]);

    blockStore.activeBlock = activeBlockMother.withContent().create();

    expect(() => handler.execute(command)).toThrow(expect.any(RangeError));
  });
});
