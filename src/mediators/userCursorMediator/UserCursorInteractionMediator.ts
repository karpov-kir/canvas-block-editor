import { Vector } from '../../math/Vector';
import { BlockRectStore } from '../../stores/BlockRectStore';
import { BlockStore } from '../../stores/BlockStore';
import { ExternalEvent } from '../../utils/ExternalEvent';
import { Mediator } from '../../utils/Mediator';
import { CommandBus } from '../../utils/pubSub/CommandBus';
import { clickHandler } from './handlers/clickHandler';
import { doubleClickHandler } from './handlers/doubleClickHandler';
import { moveHandler } from './handlers/moveHandler';

interface CursorEventData {
  position: Vector;
}

export class CursorEvent extends ExternalEvent {
  constructor(public readonly type: string, public readonly data: CursorEventData) {
    super();
  }
}

export class UserCursorInteractionMediator implements Mediator<CursorEvent> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blockStore: BlockStore,
    private readonly blockRectStore: BlockRectStore,
  ) {}

  notify(cursorEvent: CursorEvent) {
    if (cursorEvent.type === 'double-click') {
      doubleClickHandler(this.commandBus);
    } else if (cursorEvent.type === 'move') {
      moveHandler(cursorEvent, this.blockStore, this.blockRectStore, this.commandBus);
    } else if (cursorEvent.type === 'click') {
      clickHandler(cursorEvent, this.blockStore, this.blockRectStore, this.commandBus);
    }
  }
}
