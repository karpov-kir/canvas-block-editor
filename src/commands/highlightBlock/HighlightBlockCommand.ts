import { Command } from '../../utils/pubSub/Command';

export class HighlightBlockCommand extends Command {
  constructor(public readonly blockId: number) {
    super();
  }
}
