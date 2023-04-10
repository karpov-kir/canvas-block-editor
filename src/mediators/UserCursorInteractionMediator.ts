import { AddBlockCommand } from '../commands/addBlock/AddBlockCommand';
import { CommandBus } from '../utils/CommandBus';
import { Mediator } from '../utils/Mediator';

export class CursorEvent {
  constructor(public readonly type: string) {}
}

export class UserCursorInteractionMediator implements Mediator<CursorEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  notify(cursorEvent: CursorEvent) {
    if (cursorEvent.type === 'double-click') {
      this.commandBus.publish(new AddBlockCommand('text'));
    }
  }
}
