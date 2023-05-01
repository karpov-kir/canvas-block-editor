import { Command } from '../../utils/pubSub/Command';

export class InputCommand extends Command {
  constructor(public readonly blockId: number, public readonly content: string) {
    super();
  }
}
