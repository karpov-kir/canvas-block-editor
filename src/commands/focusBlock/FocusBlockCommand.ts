import { Command } from '../../utils/Command';

export class FocusBlockCommand extends Command {
  constructor(public readonly blockId: number) {
    super();
  }
}
