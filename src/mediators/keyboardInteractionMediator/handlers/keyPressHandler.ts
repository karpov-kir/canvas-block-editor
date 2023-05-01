import { InputCommand } from '../../../commands/input/InputCommand';
import { BlockStore } from '../../../stores/BlockStore';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { KeyboardInteractionKeyPressEvent } from '../KeyboardInteractionMediator';

export function keyPressHandler(
  event: KeyboardInteractionKeyPressEvent,
  blockStore: BlockStore,
  commandBus: CommandBus,
) {
  if (!blockStore.focusedBlocks.size) {
    return;
  }

  blockStore.focusedBlocks.forEach((block) => {
    commandBus.publish(new InputCommand(block.id, event.key));
  });
}
