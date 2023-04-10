import { BaseCommand } from '../../utils/BaseCommand';

export class AddBlockCommand extends BaseCommand {
  constructor(public readonly type: string) {
    super();
  }
}
