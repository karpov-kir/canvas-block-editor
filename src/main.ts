import { AddBlockCommand } from './commands/addBlock/AddBlockCommand';
import { AddBlockHandler } from './commands/addBlock/AddBlockHandler';
import { ChangeBlockTypeCommand } from './commands/changeBlockType/ChangeBlockTypeCommand';
import { ChangeBlockTypeHandler } from './commands/changeBlockType/ChangeBlockTypeHandler';
import { FocusBlockCommand } from './commands/focusBlock/FocusBlockCommand';
import { FocusBlockHandler } from './commands/focusBlock/FocusBlockHandler';
import { HighlightBlockCommand } from './commands/highlightBlock/HighlightBlockCommand';
import { HighlightBlockHandler } from './commands/highlightBlock/HighlightBlockHandler';
import { InputCommand } from './commands/input/InputCommand';
import { InputHandler } from './commands/input/InputHandler';
import { MoveCarriageCommand } from './commands/moveCarriage/MoveCarriageCommand';
import { MoveCarriageHandler } from './commands/moveCarriage/MoveCarriageHandler';
import { RemoveHighlightFromBlockCommand } from './commands/removeHighlightFromBlock/RemoveHighlightFromBlockCommand';
import { RemoveHighlightFromBlockHandler } from './commands/removeHighlightFromBlock/RemoveHighlightFromBlockHandler';
import { RenderCommand } from './commands/render/RenderCommand';
import { RenderCommandHandler } from './commands/render/RenderCommandHandler';
import { RenderService } from './commands/render/RenderService';
import { ResizeDocumentCommand } from './commands/resizeDocument/ResizeDocumentCommand';
import { ResizeDocumentHandler } from './commands/resizeDocument/ResizeDocumentHandler';
import { ResizeDocumentService } from './commands/resizeDocument/ResizeDocumentService';
import { Dimensions } from './math/Dimensions';
import { Vector } from './math/Vector';
import { CursorEvent, UserCursorInteractionMediator } from './mediators/userCursorInteractionMediator/UserCursorInteractionMediator';
import { UserKeyboardInteractionMediator } from './mediators/userKeyboardInteractionMediator/UserKeyboardInteractionMediator';
import {
  DocumentEvent,
  UserViewportInteractionMediator,
} from './mediators/userViewportInteractionMediator/UserViewportInteractionMediator';
import { RenderSaga } from './sagas/RenderSaga';
import { BlockRectStore } from './stores/BlockRectStore';
import { BlockStore, BlockType } from './stores/BlockStore';
import { DocumentStore } from './stores/DocumentStore';
import { CanvasDrawer } from './utils/CanvasDrawer';
import { CommandBus } from './utils/pubSub/CommandBus';
import { EventBus } from './utils/pubSub/EventBus';

const htmlElement = document.querySelector('html') as HTMLHtmlElement;
const bodyElement = document.querySelector('body') as HTMLBodyElement;

const containerElement = document.createElement('div') as HTMLDivElement;

containerElement.style.overflow = 'hidden';

const canvasElement = document.createElement('canvas') as HTMLCanvasElement;
const canvasContext = canvasElement.getContext('2d') as CanvasRenderingContext2D;

const resetStyles = (element: ElementCSSInlineStyle) => {
  element.style.width = '100%';
  element.style.height = '100%';
  element.style.margin = '0';
  element.style.padding = '0';
};

resetStyles(htmlElement);
resetStyles(bodyElement);
resetStyles(containerElement);
resetStyles(canvasElement);

document.body.appendChild(containerElement);
containerElement.appendChild(canvasElement);

canvasElement.width = 0;
canvasElement.height = 0;

canvasElement.style.height = '0px';
canvasElement.style.width = '0px';

// ==============

const eventBus = new EventBus();
const commandBus = new CommandBus();
const blockStore = new BlockStore();
const blockRectStore = new BlockRectStore();
const documentStore = new DocumentStore();
const canvasDrawer = new CanvasDrawer(canvasContext);
const renderService = new RenderService(canvasDrawer, blockStore, blockRectStore);
const resizeDocumentService = new ResizeDocumentService(canvasDrawer, documentStore);

commandBus.subscribe(AddBlockCommand, (command) => new AddBlockHandler(blockStore, eventBus).execute(command as any));
commandBus.subscribe(ChangeBlockTypeCommand, (command) =>
  new ChangeBlockTypeHandler(blockStore, eventBus).execute(command as any),
);
commandBus.subscribe(FocusBlockCommand, (command) =>
  new FocusBlockHandler(blockStore, eventBus).execute(command as any),
);
commandBus.subscribe(HighlightBlockCommand, (command) =>
  new HighlightBlockHandler(blockStore, eventBus).execute(command as any),
);
commandBus.subscribe(InputCommand, (command) => new InputHandler(blockStore, eventBus).execute(command as any));
commandBus.subscribe(MoveCarriageCommand, (command) =>
  new MoveCarriageHandler(blockStore, eventBus).execute(command as any),
);
commandBus.subscribe(RemoveHighlightFromBlockCommand, (command) =>
  new RemoveHighlightFromBlockHandler(blockStore, eventBus).execute(command as any),
);
commandBus.subscribe(
  RenderCommand,
  (command) => new RenderCommandHandler(renderService, eventBus).execute(command) as any,
);
commandBus.subscribe(ResizeDocumentCommand, (command) =>
  new ResizeDocumentHandler(resizeDocumentService, eventBus).execute(command as any),
);

const userCursorMediator = new UserCursorInteractionMediator(commandBus, blockStore, blockRectStore);
new UserKeyboardInteractionMediator(commandBus, blockStore);
const viewportMediator = new UserViewportInteractionMediator(commandBus, documentStore);

new RenderSaga(eventBus, commandBus);

commandBus.publish(new AddBlockCommand(BlockType.CreateBlock));
commandBus.publish(new ResizeDocumentCommand(new Dimensions(1000, 1000)));

window.addEventListener('resize', () => {
  viewportMediator.notify(
    new DocumentEvent('resize', {
      dimensions: new Dimensions(window.innerWidth, window.innerHeight),
    }),
  );
});

containerElement.addEventListener('mousemove', (event: MouseEvent) => {
  userCursorMediator.notify(
    new CursorEvent('move', {
      position: new Vector(event.clientX, event.clientY),
    }),
  );
});

containerElement.addEventListener('click', (event: MouseEvent) => {
  userCursorMediator.notify(
    new CursorEvent('click', {
      position: new Vector(event.clientX, event.clientY),
    }),
  );
});
