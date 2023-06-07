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

  execute({ blockId, content }: InputCommand) {
    const block = this.blockStore.getById(blockId);

    if (block.selection) {
      const contentBeforeSelection = block.content.slice(0, block.selection.start);
      const contentAfterSelection = block.content.slice(block.selection.end);
      const newContentBeforeCarriage = contentBeforeSelection + content;

      block.content = newContentBeforeCarriage + contentAfterSelection;
      block.selection = undefined;
      block.carriagePosition = newContentBeforeCarriage.length;
    } else {
      const contentBeforeCarriage = block.content.slice(0, block.carriagePosition);
      const contentAfterCarriage = block.content.slice(block.carriagePosition);
      const newContentBeforeCarriage = contentBeforeCarriage + content;

      block.content = newContentBeforeCarriage + contentAfterCarriage;
      block.carriagePosition = newContentBeforeCarriage.length;
    }

    this.eventBus.publish(new InputReceivedEvent(block, content));
  }
}
