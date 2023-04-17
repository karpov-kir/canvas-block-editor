import { Command } from '../../utils/pubSub/Command';

export class SelectCommand extends Command {
  constructor(public readonly selection: [start: number, end: number]) {
    super();
  }
}
