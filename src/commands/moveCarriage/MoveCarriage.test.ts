import { BlockStore, BlockType } from '../../stores/BlockStore';
import { ActiveBlockMother } from '../../testUtils/mothers/ActiveBlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { MoveCarriageCommand } from './MoveCarriageCommand';
import { CarriageMovedEvent, MoveCarriageHandler } from './MoveCarriageHandler';

describe(MoveCarriageHandler.name, () => {
  it(`moves the carriage to a position and emits the ${CarriageMovedEvent.name}`, () => {
    const blockStore = new BlockStore();
    const eventBus = new EventBus();
    const handler = new MoveCarriageHandler(blockStore, eventBus);
    const command = new MoveCarriageCommand(5);
    const carriageMovedHandler = jest.fn();

    eventBus.subscribe(CarriageMovedEvent, carriageMovedHandler);
    blockStore.add(BlockType.Text);
    blockStore.activeBlock = new ActiveBlockMother().create();

    handler.execute(command);

    expect(blockStore.activeBlock).toEqual(
      expect.objectContaining({
        carriagePosition: 5,
      }),
    );
    expect(carriageMovedHandler).toBeCalledWith(new CarriageMovedEvent(blockStore.activeBlock.block, 5));
  });
});
