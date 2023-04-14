import { Command } from '../../utils/pubSub/Command';

export class RemoveHighlightFromBlockCommand extends Command {
  constructor(public readonly blockId: number) {
    super();
  }
}
