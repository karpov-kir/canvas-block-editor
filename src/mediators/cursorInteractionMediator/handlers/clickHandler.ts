import { AddBlockCommand } from '../../../commands/addBlock/AddBlockCommand';
import { ChangeBlockTypeCommand } from '../../../commands/changeBlockType/ChangeBlockTypeCommand';
import { FocusBlockCommand } from '../../../commands/focusBlock/FocusBlockCommand';
import { RemoveFocusFromBlockCommand } from '../../../commands/removeFocusFromBlock/RemoveFocusFromBlockCommand';
import { BlockRectStore } from '../../../stores/BlockRectStore';
import { BlockStore, BlockType } from '../../../stores/BlockStore';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { CursorInteractionClickEvent } from '../CursorInteractionMediator';

export function clickHandler(
  event: CursorInteractionClickEvent,
  blockStore: BlockStore,
  blockRectStore: BlockRectStore,
  commandBus: CommandBus,
) {
  const clickedBlockRect = blockRectStore.findByPosition(event.position);

  if (clickedBlockRect && clickedBlockRect.blockId !== blockStore.activeBlock?.block.id) {
    const clickedBlock = blockStore.blocks.get(clickedBlockRect.blockId);

    commandBus.publish(new FocusBlockCommand(clickedBlockRect.blockId));

    if (clickedBlock?.type === BlockType.CreateBlock) {
      commandBus.publish(new ChangeBlockTypeCommand(clickedBlockRect.blockId, BlockType.Text));
      commandBus.publish(new AddBlockCommand(BlockType.CreateBlock));
    }
  }

  if (!clickedBlockRect && blockStore.activeBlock) {
    commandBus.publish(new RemoveFocusFromBlockCommand(blockStore.activeBlock.block.id));
  }
}
