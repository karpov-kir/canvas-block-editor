import { AddBlockCommand } from '../../../commands/addBlock/AddBlockCommand';
import { BlockType } from '../../../stores/BlockStore';
import { CommandBus } from '../../../utils/CommandBus';

export function doubleClickHandler(commandBus: CommandBus) {
  commandBus.publish(new AddBlockCommand(BlockType.Text));
}
