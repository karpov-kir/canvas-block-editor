import { BlockType } from '../../stores/BlockStore';
import { Command } from '../../utils/pubSub/Command';

export class ChangeBlockTypeCommand extends Command {
  constructor(public readonly blockId: number, public readonly newType: BlockType) {
    super();
  }
}
