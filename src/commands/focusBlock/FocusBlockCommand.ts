import { Command } from '../../utils/pubSub/Command';

export class FocusBlockCommand extends Command {
  constructor(public readonly blockId: number) {
    super();
  }
}
