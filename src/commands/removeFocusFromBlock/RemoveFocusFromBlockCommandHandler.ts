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
    const focusedBlock = this.blockStore.getFocusedBlockById(blockId);

    this.blockStore.removeFocusFromBlock(blockId);
    this.eventBus.publish(new FocusRemovedFromBlockEvent(focusedBlock));
  }
}
