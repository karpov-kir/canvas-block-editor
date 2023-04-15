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
    const runsOn = [
      BlockAddedEvent,
      BlockTypeChangedEvent,
      BlockFocusedEvent,
      BlockHighlightedEvent,
      InputReceivedEvent,
      CarriageMovedEvent,
      HighlightRemovedFromBlockEvent,
      DocumentResizedEvent,
    ];

    runsOn.forEach((event) => {
      this.eventBus.subscribe(event, this.run);
    });
  }

  private run = () => {
    this.commandBus.publish(new RenderCommand());
  };
}
