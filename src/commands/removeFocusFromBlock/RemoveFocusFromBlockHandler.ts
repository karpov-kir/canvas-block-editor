import { Block, BlockStore } from '../../stores/BlockStore';
import { CommandHandler } from '../../utils/pubSub/Command';
import { Event } from '../../utils/pubSub/Event';
import { EventBus } from '../../utils/pubSub/EventBus';
import { RemoveFocusFromBlockCommand } from './RemoveFocusFromBlockCommand';

export class FocusRemovedFromBlockEvent extends Event {
  constructor(public readonly block: Block) {
    super();
  }
}

export class RemoveFocusFromBlockCommandHandler extends CommandHandler {
  constructor(private readonly blockStore: BlockStore, private readonly eventBus: EventBus) {
    super();
  }

  public execute({ blockId }: RemoveFocusFromBlockCommand) {
    const activeBlock = this.blockStore.activeBlock;

    if (activeBlock?.block.id !== blockId) {
      throw new Error(`Block with id ${blockId} is not active`);
    }

    this.blockStore.activeBlock = undefined;

    this.eventBus.publish(new FocusRemovedFromBlockEvent(activeBlock.block));
  }
}
