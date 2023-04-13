import { BlockRectStore } from '../../../BlockRectStore';
import { BlockStore } from '../../../BlockStore';
import { HighlightBlockCommand } from '../../../commands/highlightBlock/HighlightBlockCommand';
import { RemoveHighlightFromBlockCommand } from '../../../commands/removeHighlightFromBlock/RemoveHighlightFromBlockCommand';
import { CommandBus } from '../../../utils/CommandBus';
import { CursorEvent } from '../UserCursorInteractionMediator';

export function moveHandler(
  { data }: CursorEvent,
  blockStore: BlockStore,
  blockRectStore: BlockRectStore,
  commandBus: CommandBus,
) {
  const blockRect = blockRectStore.findByPosition(data.position);

  if (blockRect && blockStore.highlightedBlock?.id !== blockRect.blockId) {
    commandBus.publish(new HighlightBlockCommand(blockRect.blockId));
  } else if (!blockRect && blockStore.highlightedBlock) {
    commandBus.publish(new RemoveHighlightFromBlockCommand(blockStore.highlightedBlock.id));
  }
}
