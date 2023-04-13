import { BlockStore } from '../../BlockStore';
import { CommandHandler } from '../../utils/Command';
import { FocusBlockCommand } from './FocusBlockCommand';

export class FocusBlockHandler extends CommandHandler {
  constructor(private readonly blockStore: BlockStore) {
    super();
  }

  public execute({ blockId }: FocusBlockCommand) {
    const block = this.blockStore.blocks.get(blockId);

    if (!block) {
      throw new Error(`Block with id ${blockId} not found`);
    }

    this.blockStore.activeBlock = {
      block: block,
      carriagePosition: 0,
    };
  }
}
