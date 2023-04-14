import { BlockStore } from '../../stores/BlockStore';
import { CommandHandler } from '../../utils/Command';
import { ChangeBlockTypeCommand } from './ChangeBlockTypeCommand';

export class ChangeBlockTypeHandler extends CommandHandler {
  constructor(private readonly blockStore: BlockStore) {
    super();
  }

  public execute({ blockId, newType }: ChangeBlockTypeCommand) {
    const block = this.blockStore.blocks.get(blockId);

    if (!block) {
      throw new Error(`Block with id ${blockId} not found`);
    }

    block.type = newType;
  }
}
