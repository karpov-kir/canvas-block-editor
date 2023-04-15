import { InputCommand } from '../../../commands/input/InputCommand';
import { BlockStore } from '../../../stores/BlockStore';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { KeyboardEvent } from '../UserKeyboardInteractionMediator';

export function keyPressHandler(keyboardEvent: KeyboardEvent, blockStore: BlockStore, commandBus: CommandBus) {
  if (!blockStore.activeBlock) {
    return;
  }

  commandBus.publish(new InputCommand(keyboardEvent.key));
}
