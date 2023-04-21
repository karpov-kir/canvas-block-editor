import { DocumentStore } from '../../stores/DocumentStore';
import { Dimensions } from '../../utils/math/Dimensions';
import { Mediator, MediatorEvent } from '../../utils/Mediator';
import { CommandBus } from '../../utils/pubSub/CommandBus';
import { resizeHandler } from './handlers/resizeHandler';

enum ViewportInteractionEventType {
  Resize = 'resize',
}

export class ViewportInteractionResizeEvent implements MediatorEvent {
  public readonly type = ViewportInteractionEventType.Resize;
  constructor(public readonly dimensions: Dimensions) {}
}

export type ViewportInteractionEvent = ViewportInteractionResizeEvent;

export class ViewportInteractionMediator implements Mediator<ViewportInteractionEvent> {
  constructor(private readonly commandBus: CommandBus, private readonly documentStore: DocumentStore) {}

  public notify(event: ViewportInteractionEvent) {
    if (event.type === ViewportInteractionEventType.Resize) {
      resizeHandler(event, this.documentStore, this.commandBus);
    }
  }
}
