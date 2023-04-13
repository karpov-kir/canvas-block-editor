import { BlockRectStore } from '../BlockRectStore';
import { BlockStore } from '../BlockStore';
import { AddBlockCommand } from '../commands/addBlock/AddBlockCommand';
import { FocusBlockCommand } from '../commands/focusBlock/FocusBlockCommand';
import { HighlightBlockCommand } from '../commands/highlightBlock/HighlightBlockCommand';
import { isPointInside } from '../math/isPointInside';
import { Vector } from '../math/Vector';
import { CommandBus } from '../utils/CommandBus';
import { Mediator } from '../utils/Mediator';

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

  notify({ type, data }: CursorEvent) {
    if (type === 'double-click') {
      this.commandBus.publish(new AddBlockCommand('text'));
    } else if (type === 'move') {
      for (const block of this.blockStore.blocks.values()) {
        const blockRect = this.blockRectStore.blockRects.get(block.id);
        if (blockRect && isPointInside(data.position, blockRect)) {
          if (this.blockStore.highlightedBlock?.id !== blockRect.blockId) {
            this.commandBus.publish(new HighlightBlockCommand(block.id));
          }
          break;
        }
      }
    } else if (type === 'click') {
      for (const block of this.blockStore.blocks.values()) {
        const blockRect = this.blockRectStore.blockRects.get(block.id);
        if (blockRect && isPointInside(data.position, blockRect)) {
          if (this.blockStore.activeBlock?.block.id !== blockRect.blockId) {
            this.commandBus.publish(new FocusBlockCommand(block.id));
          }
          break;
        }
      }
    }
  }
}
