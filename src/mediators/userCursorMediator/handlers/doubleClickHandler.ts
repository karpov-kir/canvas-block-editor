import { AddBlockCommand } from '../../../commands/addBlock/AddBlockCommand';
import { CommandBus } from '../../../utils/CommandBus';

export function doubleClickHandler(commandBus: CommandBus) {
  commandBus.publish(new AddBlockCommand('text'));
}
