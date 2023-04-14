import { Block, BlockStore } from '../../stores/BlockStore';
import { CommandHandler } from '../../utils/pubSub/Command';
import { Event } from '../../utils/pubSub/Event';
import { EventBus } from '../../utils/pubSub/EventBus';
import { AddBlockCommand } from './AddBlockCommand';

export class BlockAddedEvent extends Event {
  constructor(public readonly block: Block) {
    super();
  }
}

export class AddBlockHandler extends CommandHandler {
  constructor(private readonly blockStore: BlockStore, private readonly eventBus: EventBus) {
    super();
  }

  public execute(command: AddBlockCommand) {
    const block = this.blockStore.add(command.type);
    this.eventBus.publish(new BlockAddedEvent(block));
  }
}
