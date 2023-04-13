import { BlockRectStore } from '../../../BlockRectStore';
import { BlockStore } from '../../../BlockStore';
import { HighlightBlockCommand } from '../../../commands/highlightBlock/HighlightBlockCommand';
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
  }
}
