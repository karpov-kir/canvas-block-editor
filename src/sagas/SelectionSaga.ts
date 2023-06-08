import { BlockTypeChangedEvent } from '../commands/changeBlockType/ChangeBlockTypeCommandHandler';
import { BlockHighlightedEvent } from '../commands/highlightBlock/HighlightBlockCommandHandler';
import { HighlightRemovedFromBlockEvent } from '../commands/removeHighlightFromBlock/RemoveHighlightFromBlockCommandHandler';
import { RenderedEvent } from '../commands/render/RenderCommandHandler';
import { Selection } from '../commands/select/SelectCommand';
import { BlockType } from '../stores/BlockStore';
import { Event } from '../utils/pubSub/Event';
import { EventBus } from '../utils/pubSub/EventBus';

export type SelectHandler = (data: { blockId: number; selection: Selection }) => void;
export type UnselectHandler = () => void;

export interface SelectionManager {
  enable(blockId: number): void;
  readonly isEnabled: boolean;
  readonly isSelecting: boolean;
  disable(): void;
  update(): void;
  onSelect(handler: SelectHandler): void;
  onUnselect(handler: UnselectHandler): void;
}

export class SelectionSaga {
  constructor(private readonly eventBus: EventBus, private readonly selectionManager: SelectionManager) {
    const runsOn = [BlockHighlightedEvent, HighlightRemovedFromBlockEvent, RenderedEvent, BlockTypeChangedEvent];

    runsOn.forEach((event) => {
      this.eventBus.subscribe(event, this.run);
    });
  }

  private run = (event: Event) => {
    if (event instanceof BlockHighlightedEvent || event instanceof BlockTypeChangedEvent) {
      if (this.selectionManager.isSelecting) {
        return;
      }

      if (event.block.type !== BlockType.CreateBlock) {
        this.selectionManager.enable(event.block.id);
      }
    } else if (event instanceof HighlightRemovedFromBlockEvent) {
      if (this.selectionManager.isSelecting) {
        return;
      }

      this.selectionManager.disable();
    } else if (event instanceof RenderedEvent) {
      this.selectionManager.update();
    }
  };
}
