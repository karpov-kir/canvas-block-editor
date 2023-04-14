import { Dimensions } from '../../math/Dimensions';
import { Command } from '../../utils/Command';

export class ResizeDocumentCommand extends Command {
  constructor(public readonly dimensions: Dimensions) {
    super();
  }
}
