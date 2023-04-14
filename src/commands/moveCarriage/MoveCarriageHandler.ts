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

export class MoveCarriageHandler extends CommandHandler {
  constructor(private readonly blockStore: BlockStore, private readonly eventBus: EventBus) {
    super();
  }

  execute(command: MoveCarriageCommand) {
    const { activeBlock } = this.blockStore;

    if (!activeBlock) {
      throw new Error('No active block');
    }

    activeBlock.carriagePosition = command.position;

    this.eventBus.publish(new CarriageMovedEvent(activeBlock.block, command.position));
  }
}
