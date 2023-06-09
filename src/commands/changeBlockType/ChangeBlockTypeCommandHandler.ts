import { Block, BlockStore } from '../../stores/BlockStore';
import { CommandHandler } from '../../utils/pubSub/Command';
import { Event } from '../../utils/pubSub/Event';
import { EventBus } from '../../utils/pubSub/EventBus';
import { ChangeBlockTypeCommand } from './ChangeBlockTypeCommand';

export class BlockTypeChangedEvent extends Event {
  constructor(public readonly block: Block, public readonly oldType: string) {
    super();
  }
}

export class ChangeBlockTypeCommandHandler extends CommandHandler {
  constructor(private readonly blockStore: BlockStore, private readonly eventBus: EventBus) {
    super();
  }

  public execute({ blockId, newType }: ChangeBlockTypeCommand) {
    const block = this.blockStore.getById(blockId);

    const oldType = block.type;
    block.type = newType;

    this.eventBus.publish(new BlockTypeChangedEvent(block, oldType));
  }
}
