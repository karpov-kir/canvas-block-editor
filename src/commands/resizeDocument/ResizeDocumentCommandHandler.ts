import { Command } from '../../utils/Command';
import { ResizeDocumentCommand } from './ResizeDocumentCommand';
import { ResizeDocumentService } from './ResizeDocumentService';

export class ResizeDocumentCommandHandler extends Command {
  constructor(private readonly resizeDocumentService: ResizeDocumentService) {
    super();
  }

  execute(command: ResizeDocumentCommand) {
    this.resizeDocumentService.updateDimensions(command.dimensions);
  }
}
