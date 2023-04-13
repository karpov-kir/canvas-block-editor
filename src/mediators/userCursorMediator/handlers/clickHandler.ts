import { BlockRectStore } from '../../../BlockRectStore';
import { BlockStore } from '../../../BlockStore';
import { FocusBlockCommand } from '../../../commands/focusBlock/FocusBlockCommand';
import { CommandBus } from '../../../utils/CommandBus';
import { CursorEvent } from '../UserCursorInteractionMediator';

export function clickHandler(
  { data }: CursorEvent,
  blockStore: BlockStore,
  blockRectStore: BlockRectStore,
  commandBus: CommandBus,
) {
  const blockRect = blockRectStore.findByPosition(data.position);

  if (blockRect && blockStore.activeBlock?.block.id !== blockRect.blockId) {
    commandBus.publish(new FocusBlockCommand(blockRect.blockId));
  }
}
