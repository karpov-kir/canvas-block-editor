import { BlockStore } from '../../stores/BlockStore';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { MoveCarriageCommand } from './MoveCarriageCommand';
import { CarriageMovedEvent, MoveCarriageCommandHandler } from './MoveCarriageCommandHandler';

describe(MoveCarriageCommandHandler.name, () => {
  it(`moves the carriage to a position and emits the ${CarriageMovedEvent.name}`, () => {
    const blockMother = new BlockMother();
    const blockStore = new BlockStore();
    const eventBus = new EventBus();
    const carriageMovedEventHandler = jest.fn();

    eventBus.subscribe(CarriageMovedEvent, carriageMovedEventHandler);
    blockStore.blocks.set(blockMother.create().id, blockMother.last);
    blockStore.focusBlock(blockMother.last.id);

    new MoveCarriageCommandHandler(blockStore, eventBus).execute(new MoveCarriageCommand(blockMother.last.id, 5));

    expect(blockStore.getById(blockMother.last.id)).toEqual(
      expect.objectContaining({
        carriagePosition: 5,
      }),
    );
    expect(carriageMovedEventHandler).toBeCalledWith(new CarriageMovedEvent(blockMother.last, 5));
  });
});
