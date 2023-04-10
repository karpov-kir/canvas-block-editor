import { BlockStore } from '../../BlockStore';
import { CommandHandler } from '../../utils/Command';
import { InputCommand } from './InputCommand';

export class InputCommandHandler extends CommandHandler {
  constructor(private readonly blockStore: BlockStore) {
    super();
  }

  execute(command: InputCommand) {
    const activeBlock = this.blockStore.activeBlock;

    if (!activeBlock) {
      throw new Error('No active block');
    }

    activeBlock.block.content += command.content;
  }
}
