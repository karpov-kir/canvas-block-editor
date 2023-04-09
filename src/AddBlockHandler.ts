import { AddBlockCommand } from './AddBlockCommand';
import { BlockStore } from './BlockStore';

export class AddBlockHandler {
  constructor(private readonly blockStore: BlockStore) {}

  public handle(command: AddBlockCommand) {
    this.blockStore.add(command.type);
  }
}
