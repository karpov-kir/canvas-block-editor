import { ResizeDocumentCommand } from '../../../commands/resizeDocument/ResizeDocumentCommand';
import { Dimensions } from '../../../math/Dimensions';
import { DocumentStore } from '../../../stores/DocumentStore';
import { CommandBus } from '../../../utils/pubSub/CommandBus';

export function resizeHandler(resizeEvent: UIEvent, documentStore: DocumentStore, commandBus: CommandBus) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  if (width !== documentStore.dimensions.width || height !== documentStore.dimensions.height) {
    commandBus.publish(new ResizeDocumentCommand(new Dimensions(width, height)));
  }
}
