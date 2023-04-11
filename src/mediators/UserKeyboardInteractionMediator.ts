import { BlockStore } from '../BlockStore';
import { InputCommand } from '../commands/input/InputCommand';
import { CommandBus } from '../utils/CommandBus';
import { Mediator } from '../utils/Mediator';

export class KeyboardEvent {
  constructor(public readonly type: string, public readonly key: string) {}
}

export class UserKeyboardInteractionMediator implements Mediator<KeyboardEvent> {
  constructor(private readonly commandBus: CommandBus, private readonly blockStore: BlockStore) {}

  notify(keyboardEvent: KeyboardEvent) {
    if (keyboardEvent.type === 'key-press' && this.blockStore.activeBlock) {
      this.commandBus.publish(new InputCommand(keyboardEvent.key));
    }
  }
}
