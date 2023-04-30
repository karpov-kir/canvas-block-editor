import { BlockFocusedEvent } from '../commands/focusBlock/FocusBlockCommandHandler';
import { FocusRemovedFromBlockEvent } from '../commands/removeFocusFromBlock/RemoveFocusFromBlockCommandHandler';
import { RenderedEvent } from '../commands/render/RenderCommandHandler';
import { Selection } from '../commands/select/SelectCommand';
import { Event } from '../utils/pubSub/Event';
import { EventBus } from '../utils/pubSub/EventBus';

export type SelectCommandHandler = (selection: Selection) => void;
export type UnselectCommandHandler = () => void;

export interface SelectionManager {
  enable(): void;
  isEnabled: boolean;
  disable(): void;
  resetPosition(): void;
  update(): void;
  onSelect(handler: SelectCommandHandler): void;
  onUnselect(handler: UnselectCommandHandler): void;
}

export class SelectionSaga {
  constructor(private readonly eventBus: EventBus, private readonly selectionManager: SelectionManager) {
    const runsOn = [BlockFocusedEvent, FocusRemovedFromBlockEvent, RenderedEvent];

    runsOn.forEach((event) => {
      this.eventBus.subscribe(event, this.run);
    });
  }

  private run = (event: Event) => {
    if (event instanceof BlockFocusedEvent) {
      this.selectionManager.enable();
    } else if (event instanceof FocusRemovedFromBlockEvent) {
      this.selectionManager.disable();
      this.selectionManager.resetPosition();
    } else if (event instanceof RenderedEvent) {
      this.selectionManager.update();
    }
  };
}
