import { Command } from '../../utils/Command';

export class AddBlockCommand extends Command {
  constructor(public readonly type: string) {
    super();
  }
}
