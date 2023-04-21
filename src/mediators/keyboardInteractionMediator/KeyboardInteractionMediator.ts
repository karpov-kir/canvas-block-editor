import { BlockStore } from '../../stores/BlockStore';
import { Mediator, MediatorEvent } from '../../utils/Mediator';
import { CommandBus } from '../../utils/pubSub/CommandBus';
import { keyPressHandler } from './handlers/keyPressHandler';

enum KeyboardInteractionEventType {
  KeyPress = 'keyPress',
}

export class KeyboardInteractionKeyPressEvent implements MediatorEvent {
  public readonly type = KeyboardInteractionEventType.KeyPress;
  constructor(public readonly key: string) {}
}

export type KeyboardInteractionEvent = KeyboardInteractionKeyPressEvent;

export class KeyboardInteractionMediator implements Mediator<KeyboardInteractionEvent> {
  constructor(private readonly commandBus: CommandBus, private readonly blockStore: BlockStore) {}

  notify(event: KeyboardInteractionEvent) {
    if (event.type === KeyboardInteractionEventType.KeyPress) {
      keyPressHandler(event, this.blockStore, this.commandBus);
    }
  }
}
