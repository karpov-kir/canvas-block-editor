import { BlockStore } from '../../BlockStore';
import { CommandHandler } from '../../utils/Command';
import { AddBlockCommand } from './AddBlockCommand';

export class AddBlockHandler extends CommandHandler {
  constructor(private readonly blockStore: BlockStore) {
    super();
  }

  public execute(command: AddBlockCommand) {
    this.blockStore.add(command.type, { x: 0, y: 0 });
  }
}
