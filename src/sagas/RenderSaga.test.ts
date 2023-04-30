import { BlockAddedEvent } from '../commands/addBlock/AddBlockCommandHandler';
import { BlockTypeChangedEvent } from '../commands/changeBlockType/ChangeBlockTypeCommandHandler';
import { BlockFocusedEvent } from '../commands/focusBlock/FocusBlockCommandHandler';
import { BlockHighlightedEvent } from '../commands/highlightBlock/HighlightBlockCommandHandler';
import { InputReceivedEvent } from '../commands/input/InputCommandHandler';
import { CarriageMovedEvent } from '../commands/moveCarriage/MoveCarriageCommandHandler';
import { FocusRemovedFromBlockEvent } from '../commands/removeFocusFromBlock/RemoveFocusFromBlockCommandHandler';
import { HighlightRemovedFromBlockEvent } from '../commands/removeHighlightFromBlock/RemoveHighlightFromBlockCommandHandler';
import { RenderCommand } from '../commands/render/RenderCommand';
import { RenderedEvent } from '../commands/render/RenderCommandHandler';
import { DocumentResizedEvent } from '../commands/resizeDocument/ResizeDocumentCommandHandler';
import { BlockType } from '../stores/BlockStore';
import { CommandHandlerStub } from '../testUtils/CommandHandlerStub';
import { BlockMother } from '../testUtils/mothers/BlockMother';
import { Dimensions } from '../utils/math/Dimensions';
import { CommandBus } from '../utils/pubSub/CommandBus';
import { EventBus } from '../utils/pubSub/EventBus';
import { RenderSaga } from './RenderSaga';

const blockMother = new BlockMother();

describe(RenderSaga, () => {
  it(`listens for some events and dispatches the ${RenderCommand.name}`, () => {
    const eventBus = new EventBus();
    const commandBus = new CommandBus();
    const eventsThatShouldTriggerRender = [
      new BlockAddedEvent(blockMother.create()),
      new BlockTypeChangedEvent(blockMother.create(), BlockType.CreateBlock),
      new BlockFocusedEvent(blockMother.create()),
      new FocusRemovedFromBlockEvent(blockMother.create()),
      new BlockHighlightedEvent(blockMother.create()),
      new InputReceivedEvent(blockMother.create(), 'Test'),
      new CarriageMovedEvent(blockMother.create(), 5),
      new HighlightRemovedFromBlockEvent(blockMother.create()),
      new DocumentResizedEvent(new Dimensions()),
    ];
    const eventsThatShouldNotTriggerRender = [new RenderedEvent()];
    const renderCommandHandler = new CommandHandlerStub();

    new RenderSaga(eventBus, commandBus);

    commandBus.subscribe(RenderCommand, renderCommandHandler);

    eventsThatShouldTriggerRender.forEach((event) => {
      eventBus.publish(event);
    });
    eventsThatShouldNotTriggerRender.forEach((event) => {
      eventBus.publish(event);
    });

    expect(renderCommandHandler.execute).toBeCalledTimes(eventsThatShouldTriggerRender.length);
  });
});
