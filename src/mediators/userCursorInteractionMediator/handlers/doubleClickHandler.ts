import { AddBlockCommand } from '../../../commands/addBlock/AddBlockCommand';
import { BlockType } from '../../../stores/BlockStore';
import { CommandBus } from '../../../utils/pubSub/CommandBus';

export function doubleClickHandler(doubleClickEvent: MouseEvent, commandBus: CommandBus) {
  commandBus.publish(new AddBlockCommand(BlockType.Text));
}
