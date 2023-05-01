import { Selection } from '../../commands/select/SelectCommand';
import { BlockRectStore } from '../../stores/BlockRectStore';
import { BlockStore } from '../../stores/BlockStore';
import { Vector } from '../../utils/math/Vector';
import { Mediator, MediatorEvent } from '../../utils/Mediator';
import { CommandBus } from '../../utils/pubSub/CommandBus';
import { clickHandler } from './handlers/clickHandler';
import { doubleClickHandler } from './handlers/doubleClickHandler';
import { moveHandler } from './handlers/moveHandler';
import { selectHandler } from './handlers/selectHandler';

enum CursorInteractionEventType {
  Click = 'click',
  Move = 'move',
  DoubleClick = 'doubleClick',
  Select = 'select',
  Unselect = 'unselect',
}

export class CursorInteractionClickEvent implements MediatorEvent {
  public readonly type = CursorInteractionEventType.Click;
  constructor(public readonly position: Vector) {}
}

export class CursorInteractionMoveEvent implements MediatorEvent {
  public readonly type = CursorInteractionEventType.Move;
  constructor(public readonly position: Vector) {}
}

export class CursorInteractionDoubleClickEvent implements MediatorEvent {
  public readonly type = CursorInteractionEventType.DoubleClick;
  constructor(public readonly position: Vector) {}
}

export class CursorInteractionSelectEvent implements MediatorEvent {
  public readonly type = CursorInteractionEventType.Select;
  constructor(public readonly blockId: number, public readonly selection: Selection) {}
}

export class CursorInteractionUnselectEvent implements MediatorEvent {
  public readonly type = CursorInteractionEventType.Unselect;
}

export type CursorInteractionEvent =
  | CursorInteractionClickEvent
  | CursorInteractionMoveEvent
  | CursorInteractionDoubleClickEvent
  | CursorInteractionSelectEvent
  | CursorInteractionUnselectEvent;

export class CursorInteractionMediator implements Mediator<CursorInteractionEvent> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blockStore: BlockStore,
    private readonly blockRectStore: BlockRectStore,
  ) {}

  notify(event: CursorInteractionEvent) {
    if (event.type === CursorInteractionEventType.DoubleClick) {
      doubleClickHandler(event, this.commandBus);
    } else if (event.type === CursorInteractionEventType.Move) {
      moveHandler(event, this.blockStore, this.blockRectStore, this.commandBus);
    } else if (event.type === CursorInteractionEventType.Click) {
      clickHandler(event, this.blockStore, this.blockRectStore, this.commandBus);
    } else if (event.type === CursorInteractionEventType.Select) {
      selectHandler(event, this.commandBus);
    } else if (event.type === CursorInteractionEventType.Unselect) {
    }
  }
}
