import { BlockRectStore } from '../../BlockRectStore';
import { BlockStore } from '../../BlockStore';
import { Vector } from '../../math/Vector';
import { CommandBus } from '../../utils/CommandBus';
import { Mediator } from '../../utils/Mediator';
import { clickHandler } from './handlers/clickHandler';
import { doubleClickHandler } from './handlers/doubleClickHandler';
import { moveHandler } from './handlers/moveHandler';

interface CursorEventData {
  position: Vector;
}

export class CursorEvent {
  constructor(public readonly type: string, public readonly data: CursorEventData) {}
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
