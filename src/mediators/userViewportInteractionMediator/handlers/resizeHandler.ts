import { ResizeDocumentCommand } from '../../../commands/resizeDocument/ResizeDocumentCommand';
import { DocumentStore } from '../../../stores/DocumentStore';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { DocumentEvent } from '../UserViewportInteractionMediator';

export function resizeHandler({ data }: DocumentEvent, documentStore: DocumentStore, commandBus: CommandBus) {
  if (
    data.dimensions.width !== documentStore.dimensions.width ||
    data.dimensions.height !== documentStore.dimensions.height
  ) {
    commandBus.publish(new ResizeDocumentCommand(data.dimensions));
  }
}
