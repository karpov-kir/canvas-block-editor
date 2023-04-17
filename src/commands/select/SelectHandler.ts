import { Block, BlockStore } from '../../stores/BlockStore';
import { CommandHandler } from '../../utils/pubSub/Command';
import { Event } from '../../utils/pubSub/Event';
import { EventBus } from '../../utils/pubSub/EventBus';
import { SelectCommand } from './SelectCommand';

export class SelectedEvent extends Event {
  constructor(public readonly block: Block, public readonly selection: [start: number, end: number]) {
    super();
  }
}

export class SelectHandler extends CommandHandler {
  constructor(private readonly blockStore: BlockStore, private readonly eventBus: EventBus) {
    super();
  }

  public execute({ selection }: SelectCommand) {
    const activeBlock = this.blockStore.activeBlock;

    if (!activeBlock) {
      throw new Error('No active block');
    }

    if (selection[1] >= activeBlock.block.content.length) {
      throw new RangeError('Selection is out of range');
    }

    activeBlock.selection = selection;

    this.eventBus.publish(new SelectedEvent(activeBlock.block, selection));
  }
}
