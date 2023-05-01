import { SelectCommand } from '../../../commands/select/SelectCommand';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { CursorInteractionSelectEvent } from '../CursorInteractionMediator';

export function selectHandler(event: CursorInteractionSelectEvent, commandBus: CommandBus) {
  commandBus.publish(new SelectCommand(event.blockId, event.selection));
}
