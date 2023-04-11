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
  constructor(private readonly commandBus: CommandBus, private readonly blockStore: BlockStore) {}

  notify({ type, data }: CursorEvent) {
    if (type === 'double-click') {
      this.commandBus.publish(new AddBlockCommand('text'));
    } else if (type === 'move') {
      for (const block of this.blockStore.blocks.values()) {
        if (data.x >= block.position.x && data.y >= block.position.y) {
          this.commandBus.publish(new HighlightBlockCommand(block.id));
          break;
        }
      }
    }
  }
}
