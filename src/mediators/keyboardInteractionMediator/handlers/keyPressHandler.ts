import { InputCommand } from '../../../commands/input/InputCommand';
import { BlockStore } from '../../../stores/BlockStore';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { KeyboardInteractionKeyPressEvent } from '../KeyboardInteractionMediator';

export function keyPressHandler(
  event: KeyboardInteractionKeyPressEvent,
  blockStore: BlockStore,
  commandBus: CommandBus,
) {
  if (!blockStore.activeBlock) {
    return;
  }

  commandBus.publish(new InputCommand(event.key));
}
