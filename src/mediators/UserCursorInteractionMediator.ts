import { AddBlockCommand } from '../commands/addBlock/AddBlockCommand';
import { CommandBus } from '../utils/CommandBus';

export class CursorEvent {
  constructor(public readonly type: string) {}
}

export class UserCursorInteractionMediator {
  constructor(private readonly commandBus: CommandBus) {}

  notify(cursorEvent: CursorEvent) {
    if (cursorEvent.type === 'double-click') {
      this.commandBus.publish(new AddBlockCommand('text'));
    }
  }
}
