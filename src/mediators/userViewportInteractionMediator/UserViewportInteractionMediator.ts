import { DocumentStore } from '../../stores/DocumentStore';
import { Mediator } from '../../utils/Mediator';
import { CommandBus } from '../../utils/pubSub/CommandBus';
import { resizeHandler } from './handlers/resizeHandler';

export class UserViewportInteractionMediator implements Mediator<UIEvent> {
  constructor(private readonly commandBus: CommandBus, private readonly documentStore: DocumentStore) {}

  public notify(event: UIEvent) {
    if (event.type === 'resize') {
      resizeHandler(event, this.documentStore, this.commandBus);
    }
  }
}
