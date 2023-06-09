import { SelectInBlockCommand } from '../../../commands/selectInBlock/SelectInBlockCommand';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { CursorInteractionSelectEvent } from '../CursorInteractionMediator';

export function selectHandler(event: CursorInteractionSelectEvent, commandBus: CommandBus) {
  commandBus.publish(new SelectInBlockCommand(event.blockId, event.selection));
}
