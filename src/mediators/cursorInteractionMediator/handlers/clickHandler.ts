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

  if (clickedBlockRect) {
    const clickedBlock = blockStore.getById(clickedBlockRect.blockId);
    let isAlreadyFocused = false;

    blockStore.focusedBlocks.forEach((block) => {
      if (block.id !== clickedBlockRect.blockId) {
        commandBus.publish(new RemoveFocusFromBlockCommand(block.id));
      } else {
        isAlreadyFocused = true;
      }
    });

    if (!isAlreadyFocused) {
      commandBus.publish(new FocusBlockCommand(clickedBlockRect.blockId));
    }

    if (clickedBlock.type === BlockType.CreateBlock) {
      commandBus.publish(new ChangeBlockTypeCommand(clickedBlockRect.blockId, BlockType.Text));
      commandBus.publish(new AddBlockCommand(BlockType.CreateBlock));
    }
  } else {
    blockStore.focusedBlocks.forEach((block) => {
      commandBus.publish(new RemoveFocusFromBlockCommand(block.id));
    });
  }
}
