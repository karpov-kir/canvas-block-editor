import { Command } from '../../utils/Command';

export class HighlightBlockCommand extends Command {
  constructor(public readonly blockId: number) {
    super();
  }
}
