import { BlockStore } from '../../stores/BlockStore';
import { CommandHandler } from '../../utils/Command';
import { RemoveHighlightFromBlockCommand } from './RemoveHighlightFromBlockCommand';

export class RemoveHighlightFromBlockHandler extends CommandHandler {
  constructor(private readonly blockStore: BlockStore) {
    super();
  }

  public execute({ blockId }: RemoveHighlightFromBlockCommand) {
    const block = this.blockStore.blocks.get(blockId);

    if (!block) {
      throw new Error(`Block with id ${blockId} not found`);
    }

    this.blockStore.highlightedBlock = undefined;
  }
}
