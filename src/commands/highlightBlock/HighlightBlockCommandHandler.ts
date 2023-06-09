import { Block, BlockStore } from '../../stores/BlockStore';
import { CommandHandler } from '../../utils/pubSub/Command';
import { Event } from '../../utils/pubSub/Event';
import { EventBus } from '../../utils/pubSub/EventBus';
import { HighlightBlockCommand } from './HighlightBlockCommand';

export class BlockHighlightedEvent extends Event {
  constructor(public readonly block: Block) {
    super();
  }
}

export class HighlightBlockCommandHandler extends CommandHandler {
  constructor(private readonly blockStore: BlockStore, private readonly eventBus: EventBus) {
    super();
  }

  public execute({ blockId }: HighlightBlockCommand) {
    const block = this.blockStore.getById(blockId);

    this.blockStore.highlightBlock(blockId);
    this.eventBus.publish(new BlockHighlightedEvent(block));
  }
}
