import { BlockStore } from '../../stores/BlockStore';
import { ActiveBlockMother } from '../../testUtils/mothers/ActiveBlockMother';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { MoveCarriageCommand } from './MoveCarriageCommand';
import { CarriageMovedEvent, MoveCarriageCommandHandler } from './MoveCarriageCommandHandler';

describe(MoveCarriageCommandHandler.name, () => {
  it(`moves the carriage to a position and emits the ${CarriageMovedEvent.name}`, () => {
    const blockMother = new BlockMother();
    const activeBlockMother = new ActiveBlockMother();
    const blockStore = new BlockStore();
    const eventBus = new EventBus();
    const carriageMovedHandler = jest.fn();

    eventBus.subscribe(CarriageMovedEvent, carriageMovedHandler);
    blockStore.blocks.set(blockMother.create().id, blockMother.last);
    blockStore.activeBlock = activeBlockMother.withBlock(blockMother.last).create();

    new MoveCarriageCommandHandler(blockStore, eventBus).execute(new MoveCarriageCommand(5));

    expect(blockStore.activeBlock).toEqual(
      expect.objectContaining({
        carriagePosition: 5,
      }),
    );
    expect(carriageMovedHandler).toBeCalledWith(new CarriageMovedEvent(blockStore.activeBlock.block, 5));
  });
});
