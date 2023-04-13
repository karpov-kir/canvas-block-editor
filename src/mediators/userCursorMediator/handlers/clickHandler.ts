import { FocusBlockCommand } from '../../../commands/focusBlock/FocusBlockCommand';
import { BlockRectStore } from '../../../stores/BlockRectStore';
import { BlockStore } from '../../../stores/BlockStore';
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
