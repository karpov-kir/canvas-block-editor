import { SelectCommand } from '../../../commands/select/SelectCommand';
import { BlockStore } from '../../../stores/BlockStore';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { CursorInteractionSelectEvent } from '../CursorInteractionMediator';

export function selectHandler(event: CursorInteractionSelectEvent, blockStore: BlockStore, commandBus: CommandBus) {
  const activeBlock = blockStore.activeBlock;

  if (!activeBlock) {
    return;
  }

  commandBus.publish(new SelectCommand(event.selection));
}
