import { Command } from '../../utils/pubSub/Command';

export class InputCommand extends Command {
  constructor(public readonly content: string) {
    super();
  }
}
