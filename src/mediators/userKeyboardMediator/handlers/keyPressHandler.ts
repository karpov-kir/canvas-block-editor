import { BlockStore } from '../../../BlockStore';
import { InputCommand } from '../../../commands/input/InputCommand';
import { CommandBus } from '../../../utils/CommandBus';
import { KeyboardEvent } from '../UserKeyboardInteractionMediator';

export function keyPressHandler(keyboardEvent: KeyboardEvent, blockStore: BlockStore, commandBus: CommandBus) {
  if (!blockStore.activeBlock) {
    return;
  }

  commandBus.publish(new InputCommand(keyboardEvent.key));
}
