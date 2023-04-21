import { HighlightBlockCommand } from '../../../commands/highlightBlock/HighlightBlockCommand';
import { RemoveHighlightFromBlockCommand } from '../../../commands/removeHighlightFromBlock/RemoveHighlightFromBlockCommand';
import { BlockRectStore } from '../../../stores/BlockRectStore';
import { BlockStore } from '../../../stores/BlockStore';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { CursorInteractionMoveEvent } from '../CursorInteractionMediator';

export function moveHandler(
  event: CursorInteractionMoveEvent,
  blockStore: BlockStore,
  blockRectStore: BlockRectStore,
  commandBus: CommandBus,
) {
  const blockRect = blockRectStore.findByPosition(event.position);

  if (blockRect && blockStore.highlightedBlock?.id !== blockRect.blockId) {
    commandBus.publish(new HighlightBlockCommand(blockRect.blockId));
  } else if (!blockRect && blockStore.highlightedBlock) {
    commandBus.publish(new RemoveHighlightFromBlockCommand(blockStore.highlightedBlock.id));
  }
}
