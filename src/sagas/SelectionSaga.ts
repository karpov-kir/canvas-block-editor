import { BlockHighlightedEvent } from '../commands/highlightBlock/HighlightBlockCommandHandler';
import { HighlightRemovedFromBlockEvent } from '../commands/removeHighlightFromBlock/RemoveHighlightFromBlockCommandHandler';
import { RenderedEvent } from '../commands/render/RenderCommandHandler';
import { Selection } from '../commands/select/SelectCommand';
import { BlockType } from '../stores/BlockStore';
import { Event } from '../utils/pubSub/Event';
import { EventBus } from '../utils/pubSub/EventBus';

export type SelectCommandHandler = (data: { blockId: number; selection: Selection }) => void;
export type UnselectCommandHandler = () => void;

export interface SelectionManager {
  enable(blockId: number): void;
  isEnabled: boolean;
  disable(): void;
  resetPosition(): void;
  update(): void;
  onSelect(handler: SelectCommandHandler): void;
  onUnselect(handler: UnselectCommandHandler): void;
}

export class SelectionSaga {
  constructor(private readonly eventBus: EventBus, private readonly selectionManager: SelectionManager) {
    const runsOn = [BlockHighlightedEvent, HighlightRemovedFromBlockEvent, RenderedEvent];

    runsOn.forEach((event) => {
      this.eventBus.subscribe(event, this.run);
    });
  }

  private run = (event: Event) => {
    if (event instanceof BlockHighlightedEvent) {
      if (event.block.type !== BlockType.CreateBlock) {
        this.selectionManager.enable(event.block.id);
      }
    } else if (event instanceof HighlightRemovedFromBlockEvent) {
      this.selectionManager.disable();
      this.selectionManager.resetPosition();
    } else if (event instanceof RenderedEvent) {
      this.selectionManager.update();
    }
  };
}
