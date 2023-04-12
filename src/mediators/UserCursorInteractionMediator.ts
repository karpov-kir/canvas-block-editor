import { BlockRectStore } from '../BlockRectStore';
import { BlockStore } from '../BlockStore';
import { AddBlockCommand } from '../commands/addBlock/AddBlockCommand';
import { HighlightBlockCommand } from '../commands/highlightBlock/HighlightBlockCommand';
import { CommandBus } from '../utils/CommandBus';
import { Mediator } from '../utils/Mediator';

interface CursorEventData {
  x: number;
  y: number;
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
        const blockReact = this.blockRectStore.blockRects.get(block.id);
        if (blockReact && data.x >= blockReact.position.x && data.y >= blockReact.position.y) {
          this.commandBus.publish(new HighlightBlockCommand(block.id));
          break;
        }
      }
    }
  }
}
