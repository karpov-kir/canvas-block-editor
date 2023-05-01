import { Block, BlockStore } from '../../stores/BlockStore';
import { CommandHandler } from '../../utils/pubSub/Command';
import { Event } from '../../utils/pubSub/Event';
import { EventBus } from '../../utils/pubSub/EventBus';
import { FocusBlockCommand } from './FocusBlockCommand';

export class BlockFocusedEvent extends Event {
  constructor(public readonly block: Block) {
    super();
  }
}

export class FocusBlockCommandHandler extends CommandHandler {
  constructor(private readonly blockStore: BlockStore, private readonly eventBus: EventBus) {
    super();
  }

  public execute({ blockId }: FocusBlockCommand) {
    const block = this.blockStore.getById(blockId);

    this.blockStore.focusBlock(blockId);

    this.eventBus.publish(new BlockFocusedEvent(block));
  }
}
