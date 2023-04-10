import { BlockStore } from '../../BlockStore';
import { AddBlockCommand } from './AddBlockCommand';

export class AddBlockHandler {
  constructor(private readonly blockStore: BlockStore) {}

  public execute(command: AddBlockCommand) {
    this.blockStore.add(command.type);
  }
}
