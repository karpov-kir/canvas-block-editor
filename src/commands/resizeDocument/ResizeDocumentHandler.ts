import { Dimensions } from '../../utils/math/Dimensions';
import { Command } from '../../utils/pubSub/Command';
import { Event } from '../../utils/pubSub/Event';
import { EventBus } from '../../utils/pubSub/EventBus';
import { ResizeDocumentCommand } from './ResizeDocumentCommand';
import { ResizeDocumentService } from './ResizeDocumentService';

export class DocumentResizedEvent extends Event {
  constructor(public readonly dimensions: Dimensions) {
    super();
  }
}

export class ResizeDocumentHandler extends Command {
  constructor(private readonly resizeDocumentService: ResizeDocumentService, private readonly eventBus: EventBus) {
    super();
  }

  execute(command: ResizeDocumentCommand) {
    this.resizeDocumentService.updateDimensions(command.dimensions);
    this.eventBus.publish(new DocumentResizedEvent(command.dimensions));
  }
}
