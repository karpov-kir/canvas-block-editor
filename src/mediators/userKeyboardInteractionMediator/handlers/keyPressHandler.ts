import { InputCommand } from '../../../commands/input/InputCommand';
import { BlockStore } from '../../../stores/BlockStore';
import { CommandBus } from '../../../utils/pubSub/CommandBus';

export function keyPressHandler(keypressEvent: KeyboardEvent, blockStore: BlockStore, commandBus: CommandBus) {
  if (!blockStore.activeBlock) {
    return;
  }

  commandBus.publish(new InputCommand(keypressEvent.key));
}
