import { Dimensions } from '../../utils/math/Dimensions';
import { Command } from '../../utils/pubSub/Command';

export class ResizeDocumentCommand extends Command {
  constructor(public readonly dimensions: Dimensions) {
    super();
  }
}
