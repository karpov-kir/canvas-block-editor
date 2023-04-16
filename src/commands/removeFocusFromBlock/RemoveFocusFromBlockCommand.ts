import { Command } from '../../utils/pubSub/Command';

export class RemoveFocusFromBlockCommand extends Command {
  constructor(public readonly blockId: number) {
    super();
  }
}
