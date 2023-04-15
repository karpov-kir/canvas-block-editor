import { HighlightBlockCommand } from '../../../commands/highlightBlock/HighlightBlockCommand';
import { RemoveHighlightFromBlockCommand } from '../../../commands/removeHighlightFromBlock/RemoveHighlightFromBlockCommand';
import { Vector } from '../../../math/Vector';
import { BlockRectStore } from '../../../stores/BlockRectStore';
import { BlockStore } from '../../../stores/BlockStore';
import { CommandBus } from '../../../utils/pubSub/CommandBus';

export function moveHandler(
  moveEvent: MouseEvent,
  blockStore: BlockStore,
  blockRectStore: BlockRectStore,
  commandBus: CommandBus,
) {
  const blockRect = blockRectStore.findByPosition(new Vector(moveEvent.clientX, moveEvent.clientY));

  if (blockRect && blockStore.highlightedBlock?.id !== blockRect.blockId) {
    commandBus.publish(new HighlightBlockCommand(blockRect.blockId));
  } else if (!blockRect && blockStore.highlightedBlock) {
    commandBus.publish(new RemoveHighlightFromBlockCommand(blockStore.highlightedBlock.id));
  }
}
