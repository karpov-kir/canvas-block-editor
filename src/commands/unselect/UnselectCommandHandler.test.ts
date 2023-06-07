import { BlockStore } from '../../stores/BlockStore';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { Selection } from '../select/SelectCommand';
import { UnselectCommand } from './UnselectCommand';
import { UnselectCommandHandler, UnselectedEvent } from './UnselectCommandHandler';

describe(UnselectCommandHandler.name, () => {
  let blockStore: BlockStore;
  let eventBus: EventBus;
  let handler: UnselectCommandHandler;
  let blockMother: BlockMother;

  beforeEach(() => {
    blockStore = new BlockStore();
    eventBus = new EventBus();
    handler = new UnselectCommandHandler(blockStore, eventBus);
    blockMother = new BlockMother();
  });

  it(`unselects some content and emits the ${UnselectedEvent.name}`, () => {
    const unselectedEventHandler = jest.fn();

    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.setSelection(blockMother.last.id, new Selection(0, 5));
    eventBus.subscribe(UnselectedEvent, unselectedEventHandler);

    handler.execute(new UnselectCommand(blockMother.last.id));

    expect(blockStore.getById(blockMother.last.id).selection).toBe(undefined);
    expect(unselectedEventHandler).toBeCalledWith(new UnselectedEvent(blockMother.last));
  });
});
