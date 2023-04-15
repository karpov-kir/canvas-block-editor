import { Vector } from '../../math/Vector';
import { BlockRectStore } from '../../stores/BlockRectStore';
import { BlockStore } from '../../stores/BlockStore';
import { Mediator } from '../../utils/Mediator';
import { CommandBus } from '../../utils/pubSub/CommandBus';
import { clickHandler } from './handlers/clickHandler';
import { doubleClickHandler } from './handlers/doubleClickHandler';
import { moveHandler } from './handlers/moveHandler';

export class UserCursorInteractionMediator implements Mediator<MouseEvent> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blockStore: BlockStore,
    private readonly blockRectStore: BlockRectStore,
  ) {}

  notify(mouseEvent: MouseEvent) {
    if (mouseEvent.type === 'dblclick') {
      doubleClickHandler(mouseEvent, this.commandBus);
    } else if (mouseEvent.type === 'move') {
      moveHandler(mouseEvent, this.blockStore, this.blockRectStore, this.commandBus);
    } else if (mouseEvent.type === 'click') {
      clickHandler(mouseEvent, this.blockStore, this.blockRectStore, this.commandBus);
    }
  }
}
