import { Command } from '../../utils/pubSub/Command';

export class RemoveSelectionFromBlockCommand extends Command {
  constructor(public readonly blockId: number) {
    super();
  }
}
