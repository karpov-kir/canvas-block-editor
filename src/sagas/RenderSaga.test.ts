import { BlockAddedEvent } from '../commands/addBlock/AddBlockHandler';
import { BlockTypeChangedEvent } from '../commands/changeBlockType/ChangeBlockTypeHandler';
import { BlockFocusedEvent } from '../commands/focusBlock/FocusBlockHandler';
import { BlockHighlightedEvent } from '../commands/highlightBlock/HighlightBlockHandler';
import { InputReceivedEvent } from '../commands/input/InputHandler';
import { CarriageMovedEvent } from '../commands/moveCarriage/MoveCarriageHandler';
import { HighlightRemovedFromBlockEvent } from '../commands/removeHighlightFromBlock/RemoveHighlightFromBlockHandler';
import { RenderCommand } from '../commands/render/RenderCommand';
import { RenderedEvent } from '../commands/render/RenderCommandHandler';
import { DocumentResizedEvent } from '../commands/resizeDocument/ResizeDocumentHandler';
import { BlockType } from '../stores/BlockStore';
import { CommandHandlerStub } from '../testUtils/CommandHandlerStub';
import { BlockMother } from '../testUtils/mothers/BlockMother';
import { Dimensions } from '../utils/math/Dimensions';
import { CommandBus } from '../utils/pubSub/CommandBus';
import { EventBus } from '../utils/pubSub/EventBus';
import { RenderSaga } from './RenderSaga';

const blockMother = new BlockMother();

describe(RenderSaga, () => {
  it(`listens for some events and dispatches the ${RenderCommand}`, () => {
    const eventBus = new EventBus();
    const commandBus = new CommandBus();
    const eventsThatShouldTriggerRender = [
      new BlockAddedEvent(blockMother.create()),
      new BlockTypeChangedEvent(blockMother.create(), BlockType.CreateBlock),
      new BlockFocusedEvent(blockMother.create()),
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
