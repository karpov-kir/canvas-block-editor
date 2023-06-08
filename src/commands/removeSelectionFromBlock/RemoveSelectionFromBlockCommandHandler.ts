import { Block, BlockStore } from '../../stores/BlockStore';
import { CommandHandler } from '../../utils/pubSub/Command';
import { Event } from '../../utils/pubSub/Event';
import { EventBus } from '../../utils/pubSub/EventBus';
import { RemoveSelectionFromBlockCommand } from './RemoveSelectionFromBlockCommand';

export class SelectionRemovedFromBlockEvent extends Event {
  constructor(public readonly block: Block) {
    super();
  }
}

export class RemoveSelectionFromBlockCommandHandler extends CommandHandler {
  constructor(private readonly blockStore: BlockStore, private readonly eventBus: EventBus) {
    super();
  }

  public execute({ blockId }: RemoveSelectionFromBlockCommand) {
    const block = this.blockStore.getById(blockId);

    block.selection = undefined;

    this.eventBus.publish(new SelectionRemovedFromBlockEvent(block));
  }
}
