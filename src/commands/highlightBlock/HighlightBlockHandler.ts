import { BlockStore } from '../../stores/BlockStore';
import { CommandHandler } from '../../utils/Command';
import { HighlightBlockCommand } from './HighlightBlockCommand';

export class HighlightBlockHandler extends CommandHandler {
  constructor(private readonly blockStore: BlockStore) {
    super();
  }

  public execute({ blockId }: HighlightBlockCommand) {
    const block = this.blockStore.blocks.get(blockId);

    if (!block) {
      throw new Error(`Block with id ${blockId} not found`);
    }

    this.blockStore.highlightedBlock = block;
  }
}
