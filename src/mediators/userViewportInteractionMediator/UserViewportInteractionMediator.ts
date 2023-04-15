import { Dimensions } from '../../math/Dimensions';
import { DocumentStore } from '../../stores/DocumentStore';
import { ExternalEvent } from '../../utils/ExternalEvent';
import { Mediator } from '../../utils/Mediator';
import { CommandBus } from '../../utils/pubSub/CommandBus';
import { resizeHandler } from './handlers/resizeHandler';

interface DocumentEventData {
  dimensions: Dimensions;
}

export class DocumentEvent extends ExternalEvent {
  constructor(public readonly type: string, public readonly data: DocumentEventData) {
    super();
  }
}

export class UserViewportInteractionMediator implements Mediator<DocumentEvent> {
  constructor(private readonly commandBus: CommandBus, private readonly documentStore: DocumentStore) {}

  notify(documentEvent: DocumentEvent) {
    resizeHandler(documentEvent, this.documentStore, this.commandBus);
  }
}
