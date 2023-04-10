import { InputCommand } from '../commands/inputCommand/InputCommand';
import { CommandBus } from '../utils/CommandBus';
import { Mediator } from '../utils/Mediator';

export class KeyboardEvent {
  constructor(public readonly type: string, public readonly key: string) {}
}

export class UserKeyboardInteractionMediator implements Mediator<KeyboardEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  notify(keyboardEvent: KeyboardEvent) {
    if (keyboardEvent.type === 'key-press') {
      this.commandBus.publish(new InputCommand(keyboardEvent.key));
    }
  }
}
