import { BlockStore } from '../../stores/BlockStore';
import { ExternalEvent } from '../../utils/ExternalEvent';
import { Mediator } from '../../utils/Mediator';
import { CommandBus } from '../../utils/pubSub/CommandBus';
import { keyPressHandler } from './handlers/keyPressHandler';

export class KeyboardEvent extends ExternalEvent {
  constructor(public readonly type: string, public readonly key: string) {
    super();
  }
}

export class UserKeyboardInteractionMediator implements Mediator<KeyboardEvent> {
  constructor(private readonly commandBus: CommandBus, private readonly blockStore: BlockStore) {}

  notify(keyboardEvent: KeyboardEvent) {
    if (keyboardEvent.type === 'key-press') {
      keyPressHandler(keyboardEvent, this.blockStore, this.commandBus);
    }
  }
}
