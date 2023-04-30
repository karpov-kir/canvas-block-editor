import { Block, BlockStore } from '../../stores/BlockStore';
import { CommandHandler } from '../../utils/pubSub/Command';
import { Event } from '../../utils/pubSub/Event';
import { EventBus } from '../../utils/pubSub/EventBus';
import { InputCommand } from './InputCommand';

export class InputReceivedEvent extends Event {
  constructor(public readonly block: Block, public readonly content: string) {
    super();
  }
}

export class InputCommandHandler extends CommandHandler {
  constructor(private readonly blockStore: BlockStore, private readonly eventBus: EventBus) {
    super();
  }

  execute(command: InputCommand) {
    const activeBlock = this.blockStore.activeBlock;

    if (!activeBlock) {
      throw new Error('No active block');
    }

    activeBlock.block.content += command.content;

    this.eventBus.publish(new InputReceivedEvent(activeBlock.block, command.content));
  }
}
