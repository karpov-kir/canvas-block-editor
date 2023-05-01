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
  const hoveredBlockRect = blockRectStore.findByPosition(event.position);

  blockStore.highlightedBlocks.forEach((block) => {
    if (block.id !== hoveredBlockRect?.blockId) {
      commandBus.publish(new RemoveHighlightFromBlockCommand(block.id));
    }
  });

  if (hoveredBlockRect && !blockStore.highlightedBlocks.has(hoveredBlockRect.blockId)) {
    commandBus.publish(new HighlightBlockCommand(hoveredBlockRect.blockId));
  }
}
