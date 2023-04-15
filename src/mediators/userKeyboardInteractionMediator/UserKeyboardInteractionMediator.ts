import { BlockStore } from '../../stores/BlockStore';
import { Mediator } from '../../utils/Mediator';
import { CommandBus } from '../../utils/pubSub/CommandBus';
import { keyPressHandler } from './handlers/keyPressHandler';

export class UserKeyboardInteractionMediator implements Mediator<KeyboardEvent> {
  constructor(private readonly commandBus: CommandBus, private readonly blockStore: BlockStore) {}

  notify(keyboardEvent: KeyboardEvent) {
    if (keyboardEvent.type === 'keypress') {
      keyPressHandler(keyboardEvent, this.blockStore, this.commandBus);
    }
  }
}
