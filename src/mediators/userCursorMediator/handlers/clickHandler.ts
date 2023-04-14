import { AddBlockCommand } from '../../../commands/addBlock/AddBlockCommand';
import { ChangeBlockTypeCommand } from '../../../commands/changeBlockType/ChangeBlockTypeCommand';
import { FocusBlockCommand } from '../../../commands/focusBlock/FocusBlockCommand';
import { BlockRectStore } from '../../../stores/BlockRectStore';
import { BlockStore, BlockType } from '../../../stores/BlockStore';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { CursorEvent } from '../UserCursorInteractionMediator';

export function clickHandler(
  { data }: CursorEvent,
  blockStore: BlockStore,
  blockRectStore: BlockRectStore,
  commandBus: CommandBus,
) {
  const blockRect = blockRectStore.findByPosition(data.position);

  if (blockRect && blockStore.activeBlock?.block.id !== blockRect.blockId) {
    const block = blockStore.blocks.get(blockRect.blockId);

    commandBus.publish(new FocusBlockCommand(blockRect.blockId));

    if (block?.type === BlockType.CreateBlock) {
      commandBus.publish(new ChangeBlockTypeCommand(blockRect.blockId, BlockType.Text));
      commandBus.publish(new AddBlockCommand(BlockType.CreateBlock));
    }
  }
}
