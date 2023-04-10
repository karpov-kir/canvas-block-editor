import { BlockStore } from '../../BlockStore';
import { HighlightBlockCommand } from './HighlightBlockCommand';

export class HighlightBlockHandler {
  constructor(private readonly blockStore: BlockStore) {}

  public execute({ blockId }: HighlightBlockCommand) {
    const block = this.blockStore.blocks.get(blockId);

    if (!block) {
      throw new Error(`Block with id ${blockId} not found`);
    }

    this.blockStore.highlightedBlock = block;
  }
}
