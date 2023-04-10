import { BlockStore } from '../../BlockStore';
import { CommandHandler } from '../../utils/Command';
import { MoveCarriageCommand } from './MoveCarriageCommand';

export class MoveCarriageHandler extends CommandHandler {
  constructor(private readonly blockStore: BlockStore) {
    super();
  }

  execute(command: MoveCarriageCommand) {
    const { activeBlock } = this.blockStore;

    if (!activeBlock) {
      throw new Error('No active block');
    }

    activeBlock.carriagePosition = command.position;
  }
}
