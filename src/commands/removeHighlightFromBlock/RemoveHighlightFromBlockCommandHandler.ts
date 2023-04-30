import { Block, BlockStore } from '../../stores/BlockStore';
import { CommandHandler } from '../../utils/pubSub/Command';
import { Event } from '../../utils/pubSub/Event';
import { EventBus } from '../../utils/pubSub/EventBus';
import { RemoveHighlightFromBlockCommand } from './RemoveHighlightFromBlockCommand';

export class HighlightRemovedFromBlockEvent extends Event {
  constructor(public readonly block: Block) {
    super();
  }
}

export class RemoveHighlightFromBlockCommandHandler extends CommandHandler {
  constructor(private readonly blockStore: BlockStore, private readonly eventBus: EventBus) {
    super();
  }

  public execute({ blockId }: RemoveHighlightFromBlockCommand) {
    const block = this.blockStore.blocks.get(blockId);

    if (!block) {
      throw new Error(`Block with id ${blockId} not found`);
    }

    this.blockStore.highlightedBlock = undefined;

    this.eventBus.publish(new HighlightRemovedFromBlockEvent(block));
  }
}
