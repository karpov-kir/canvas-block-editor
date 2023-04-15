import { BlockAddedEvent } from '../commands/addBlock/AddBlockHandler';
import { BlockTypeChangedEvent } from '../commands/changeBlockType/ChangeBlockTypeHandler';
import { BlockFocusedEvent } from '../commands/focusBlock/FocusBlockHandler';
import { BlockHighlightedEvent } from '../commands/highlightBlock/HighlightBlockHandler';
import { InputReceivedEvent } from '../commands/input/InputHandler';
import { CarriageMovedEvent } from '../commands/moveCarriage/MoveCarriageHandler';
import { HighlightRemovedFromBlockEvent } from '../commands/removeHighlightFromBlock/RemoveHighlightFromBlockHandler';
import { RenderCommand } from '../commands/render/RenderCommand';
import { DocumentResizedEvent } from '../commands/resizeDocument/ResizeDocumentHandler';
import { CommandBus } from '../utils/pubSub/CommandBus';
import { EventBus } from '../utils/pubSub/EventBus';

export class RenderSaga {
  constructor(private readonly eventBus: EventBus, private readonly commandBus: CommandBus) {
    this.eventBus.subscribe(BlockAddedEvent, () => this.run());
    this.eventBus.subscribe(BlockTypeChangedEvent, () => this.run());
    this.eventBus.subscribe(BlockFocusedEvent, () => this.run());
    this.eventBus.subscribe(BlockHighlightedEvent, () => this.run());
    this.eventBus.subscribe(InputReceivedEvent, () => this.run());
    this.eventBus.subscribe(CarriageMovedEvent, () => this.run());
    this.eventBus.subscribe(HighlightRemovedFromBlockEvent, () => this.run());
    this.eventBus.subscribe(DocumentResizedEvent, () => this.run());
  }

  private run() {
    this.commandBus.publish(new RenderCommand());
  }
}
