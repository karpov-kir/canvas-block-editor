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

export class FocusBlockHandler extends CommandHandler {
  constructor(private readonly blockStore: BlockStore, private readonly eventBus: EventBus) {
    super();
  }

  public execute({ blockId }: FocusBlockCommand) {
    const block = this.blockStore.blocks.get(blockId);

    if (!block) {
      throw new Error(`Block with id ${blockId} not found`);
    }

    this.blockStore.activeBlock = {
      block: block,
      carriagePosition: 0,
    };

    this.eventBus.publish(new BlockFocusedEvent(this.blockStore.activeBlock.block));
  }
}
