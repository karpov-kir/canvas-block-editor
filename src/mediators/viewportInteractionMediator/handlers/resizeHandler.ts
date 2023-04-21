import { ResizeDocumentCommand } from '../../../commands/resizeDocument/ResizeDocumentCommand';
import { DocumentStore } from '../../../stores/DocumentStore';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { ViewportInteractionResizeEvent } from '../ViewportInteractionMediator';

export function resizeHandler(
  event: ViewportInteractionResizeEvent,
  documentStore: DocumentStore,
  commandBus: CommandBus,
) {
  if (
    event.dimensions.width !== documentStore.dimensions.width ||
    event.dimensions.height !== documentStore.dimensions.height
  ) {
    commandBus.publish(new ResizeDocumentCommand(event.dimensions));
  }
}
