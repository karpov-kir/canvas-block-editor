import { Command } from '../../utils/Command';

export class MoveCarriageCommand extends Command {
  constructor(public readonly position: number) {
    super();
  }
}
