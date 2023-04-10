import { BlockStore } from '../../BlockStore';
import { InputCommand } from './InputCommand';

export class InputCommandHandler {
  constructor(private readonly blockStore: BlockStore) {}

  execute(command: InputCommand) {
    const activeBlock = this.blockStore.activeBlock;

    if (!activeBlock) {
      throw new Error('No active block');
    }

    activeBlock.block.content += command.content;
  }
}
