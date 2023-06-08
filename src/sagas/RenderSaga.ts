import { BlockAddedEvent } from '../commands/addBlock/AddBlockCommandHandler';
import { BlockTypeChangedEvent } from '../commands/changeBlockType/ChangeBlockTypeCommandHandler';
import { BlockFocusedEvent } from '../commands/focusBlock/FocusBlockCommandHandler';
import { BlockHighlightedEvent } from '../commands/highlightBlock/HighlightBlockCommandHandler';
import { InputReceivedEvent } from '../commands/input/InputCommandHandler';
import { CarriageMovedEvent } from '../commands/moveCarriage/MoveCarriageCommandHandler';
import { FocusRemovedFromBlockEvent } from '../commands/removeFocusFromBlock/RemoveFocusFromBlockCommandHandler';
import { HighlightRemovedFromBlockEvent } from '../commands/removeHighlightFromBlock/RemoveHighlightFromBlockCommandHandler';
import { SelectionRemovedFromBlockEvent } from '../commands/removeSelectionFromBlock/RemoveSelectionFromBlockCommandHandler';
import { RenderCommand } from '../commands/render/RenderCommand';
import { DocumentResizedEvent } from '../commands/resizeDocument/ResizeDocumentCommandHandler';
import { SelectedInBlockEvent } from '../commands/selectInBlock/SelectInBlockCommandHandler';
import { CommandBus } from '../utils/pubSub/CommandBus';
import { EventBus } from '../utils/pubSub/EventBus';

export class RenderSaga {
  constructor(private readonly eventBus: EventBus, private readonly commandBus: CommandBus) {
    const runsOn = [
      BlockAddedEvent,
      BlockTypeChangedEvent,
      BlockFocusedEvent,
      FocusRemovedFromBlockEvent,
      BlockHighlightedEvent,
      InputReceivedEvent,
      CarriageMovedEvent,
      HighlightRemovedFromBlockEvent,
      DocumentResizedEvent,
      SelectedInBlockEvent,
      SelectionRemovedFromBlockEvent,
    ];

    runsOn.forEach((event) => {
      this.eventBus.subscribe(event, this.run);
    });
  }

  private run = () => {
    this.commandBus.publish(new RenderCommand());
  };
}
