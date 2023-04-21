import { AddBlockCommand } from '../../../commands/addBlock/AddBlockCommand';
import { BlockType } from '../../../stores/BlockStore';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { CursorInteractionDoubleClickEvent } from '../CursorInteractionMediator';

export function doubleClickHandler(event: CursorInteractionDoubleClickEvent, commandBus: CommandBus) {
  commandBus.publish(new AddBlockCommand(BlockType.Text));
}
