import { Command } from '../../utils/pubSub/Command';

export class UnselectCommand extends Command {
  constructor(public readonly blockId: number) {
    super();
  }
}
