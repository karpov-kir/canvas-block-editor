import { Command } from '../../utils/Command';

export class RemoveHighlightFromBlockCommand extends Command {
  constructor(public readonly blockId: number) {
    super();
  }
}
