import { BlockStore } from './BlockStore';
import { InputCommand } from './InputCommand';

export class InputCommandHandler {
  constructor(private readonly blockStore: BlockStore) {}

  handle(command: InputCommand) {
    const block = this.blockStore.activeBlock;

    if (!block) {
      throw new Error('No active block');
    }

    block.content += command.content;
  }
}
