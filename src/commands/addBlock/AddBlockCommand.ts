import { BlockType } from '../../stores/BlockStore';
import { Command } from '../../utils/Command';

export class AddBlockCommand extends Command {
  constructor(public readonly type: BlockType) {
    super();
  }
}
