import { Block, BlockStore } from '../../stores/BlockStore';
import { CommandHandler } from '../../utils/pubSub/Command';
import { Event } from '../../utils/pubSub/Event';
import { EventBus } from '../../utils/pubSub/EventBus';
import { SelectInBlockCommand, Selection } from './SelectInBlockCommand';

export class SelectedInBlockEvent extends Event {
  constructor(public readonly block: Block, public readonly selection: Selection) {
    super();
  }
}

export class SelectInBlockCommandHandler extends CommandHandler {
  constructor(private readonly blockStore: BlockStore, private readonly eventBus: EventBus) {
    super();
  }

  public execute({ selection, blockId }: SelectInBlockCommand) {
    const block = this.blockStore.getById(blockId);

    this.blockStore.setSelection(block.id, selection);
    this.eventBus.publish(new SelectedInBlockEvent(block, selection));
  }
}
