import { Command } from '../../utils/Command';

export class InputCommand extends Command {
  constructor(public readonly content: string) {
    super();
  }
}
