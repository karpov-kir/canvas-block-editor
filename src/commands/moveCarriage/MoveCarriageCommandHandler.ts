import { Block, BlockStore } from '../../stores/BlockStore';
import { CommandHandler } from '../../utils/pubSub/Command';
import { Event } from '../../utils/pubSub/Event';
import { EventBus } from '../../utils/pubSub/EventBus';
import { MoveCarriageCommand } from './MoveCarriageCommand';

export class CarriageMovedEvent extends Event {
  constructor(public readonly block: Block, public readonly position: number) {
    super();
  }
}

export class MoveCarriageCommandHandler extends CommandHandler {
  constructor(private readonly blockStore: BlockStore, private readonly eventBus: EventBus) {
    super();
  }

  execute({ blockId, position }: MoveCarriageCommand) {
    const block = this.blockStore.getById(blockId);

    block.carriagePosition = position;

    this.eventBus.publish(new CarriageMovedEvent(block, position));
  }
}
