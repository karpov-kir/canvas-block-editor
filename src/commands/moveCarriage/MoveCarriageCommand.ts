import { Command } from '../../utils/pubSub/Command';

export class MoveCarriageCommand extends Command {
  constructor(public readonly blockId: number, public readonly position: number) {
    super();
  }
}
