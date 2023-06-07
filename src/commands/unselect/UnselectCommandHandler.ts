import { Block, BlockStore } from '../../stores/BlockStore';
import { CommandHandler } from '../../utils/pubSub/Command';
import { Event } from '../../utils/pubSub/Event';
import { EventBus } from '../../utils/pubSub/EventBus';
import { UnselectCommand } from './UnselectCommand';

export class UnselectedEvent extends Event {
  constructor(public readonly block: Block) {
    super();
  }
}

export class UnselectCommandHandler extends CommandHandler {
  constructor(private readonly blockStore: BlockStore, private readonly eventBus: EventBus) {
    super();
  }

  public execute({ blockId }: UnselectCommand) {
    const block = this.blockStore.getById(blockId);

    block.selection = undefined;

    this.eventBus.publish(new UnselectedEvent(block));
  }
}
