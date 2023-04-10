import { BlockStore } from '../../BlockStore';
import { MoveCarriageCommand } from './MoveCarriageCommand';

export class MoveCarriageHandler {
  constructor(private readonly blockStore: BlockStore) {}

  execute(command: MoveCarriageCommand) {
    const { activeBlock } = this.blockStore;

    if (!activeBlock) {
      throw new Error('No active block');
    }

    activeBlock.carriagePosition = command.position;
  }
}
