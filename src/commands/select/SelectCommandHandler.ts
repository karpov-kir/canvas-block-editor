import { Block, BlockStore } from '../../stores/BlockStore';
import { CommandHandler } from '../../utils/pubSub/Command';
import { Event } from '../../utils/pubSub/Event';
import { EventBus } from '../../utils/pubSub/EventBus';
import { SelectCommand, Selection } from './SelectCommand';

export class SelectedEvent extends Event {
  constructor(public readonly block: Block, public readonly selection: Selection) {
    super();
  }
}

export class SelectCommandHandler extends CommandHandler {
  constructor(private readonly blockStore: BlockStore, private readonly eventBus: EventBus) {
    super();
  }

  public execute({ selection, blockId }: SelectCommand) {
    const block = this.blockStore.getById(blockId);

    if (selection.end > block.content.length) {
      throw new RangeError('Selection is out of range');
    }

    block.selection = selection;

    this.eventBus.publish(new SelectedEvent(block, selection));
  }
}
