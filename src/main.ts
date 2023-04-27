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
import { RemoveFocusFromBlockCommand } from './commands/removeFocusFromBlock/RemoveFocusFromBlockCommand';
import { RemoveFocusFromBlockCommandHandler } from './commands/removeFocusFromBlock/RemoveFocusFromBlockHandler';
import { RemoveHighlightFromBlockCommand } from './commands/removeHighlightFromBlock/RemoveHighlightFromBlockCommand';
import { RemoveHighlightFromBlockHandler } from './commands/removeHighlightFromBlock/RemoveHighlightFromBlockHandler';
import { CanvasDrawer } from './commands/render/CanvasDrawer';
import { RenderCommand } from './commands/render/RenderCommand';
import { RenderCommandHandler } from './commands/render/RenderCommandHandler';
import { RenderService } from './commands/render/RenderService';
import { ResizeDocumentCommand } from './commands/resizeDocument/ResizeDocumentCommand';
import { ResizeDocumentHandler } from './commands/resizeDocument/ResizeDocumentHandler';
import { ResizeDocumentService } from './commands/resizeDocument/ResizeDocumentService';
import { SelectCommand } from './commands/select/SelectCommand';
import { SelectHandler } from './commands/select/SelectHandler';
import { CursorInteractionMediator } from './mediators/cursorInteractionMediator/CursorInteractionMediator';
import { subscribeToCursorInteraction } from './mediators/cursorInteractionMediator/subscribeToUserCursorInteraction';
import { TextareaSelectionManager } from './mediators/cursorInteractionMediator/TextareaSelectionManager';
import { KeyboardInteractionMediator } from './mediators/keyboardInteractionMediator/KeyboardInteractionMediator';
import { subscribeToKeyboardInteraction } from './mediators/keyboardInteractionMediator/subscribeToKeyboardnteraction';
import { subscribeToViewportInteraction } from './mediators/viewportInteractionMediator/subscribeToViewportInteraction';
import { ViewportInteractionMediator } from './mediators/viewportInteractionMediator/ViewportInteractionMediator';
import { RenderSaga } from './sagas/RenderSaga';
import { SelectionSaga } from './sagas/SelectionSaga';
import { BlockRectStore } from './stores/BlockRectStore';
import { BlockStore, BlockType } from './stores/BlockStore';
import { DocumentStore } from './stores/DocumentStore';
import { Dimensions } from './utils/math/Dimensions';
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
const renderService = new RenderService(canvasDrawer, blockStore, blockRectStore, documentStore);
const resizeDocumentService = new ResizeDocumentService(canvasDrawer, documentStore);
const textareaSelectionManager = new TextareaSelectionManager(blockStore, blockRectStore);

documentStore.maxContentWidth = 1000;
documentStore.minContentWidth = 200;

(window as any).CBE = {
  blockStore,
  blockRectStore,
  documentStore,
  commands: {
    commandBus,
    AddBlockCommand,
    ChangeBlockTypeCommand,
    FocusBlockCommand,
  },
  events: {
    eventBus,
  },
};

commandBus.subscribe(AddBlockCommand, new AddBlockHandler(blockStore, eventBus));
commandBus.subscribe(ChangeBlockTypeCommand, new ChangeBlockTypeHandler(blockStore, eventBus));
commandBus.subscribe(FocusBlockCommand, new FocusBlockHandler(blockStore, eventBus));
commandBus.subscribe(RemoveFocusFromBlockCommand, new RemoveFocusFromBlockCommandHandler(blockStore, eventBus));
commandBus.subscribe(HighlightBlockCommand, new HighlightBlockHandler(blockStore, eventBus));
commandBus.subscribe(InputCommand, new InputHandler(blockStore, eventBus));
commandBus.subscribe(MoveCarriageCommand, new MoveCarriageHandler(blockStore, eventBus));
commandBus.subscribe(RemoveHighlightFromBlockCommand, new RemoveHighlightFromBlockHandler(blockStore, eventBus));
commandBus.subscribe(ResizeDocumentCommand, new ResizeDocumentHandler(resizeDocumentService, eventBus));
commandBus.subscribe(SelectCommand, new SelectHandler(blockStore, eventBus));
commandBus.subscribe(RenderCommand, new RenderCommandHandler(renderService, eventBus));

const cursorInteractionMediator = new CursorInteractionMediator(commandBus, blockStore, blockRectStore);
const keyboardInteractionMediator = new KeyboardInteractionMediator(commandBus, blockStore);
const viewportInteractionMediator = new ViewportInteractionMediator(commandBus, documentStore);

subscribeToCursorInteraction(cursorInteractionMediator, containerElement, textareaSelectionManager);
subscribeToKeyboardInteraction(keyboardInteractionMediator);
subscribeToViewportInteraction(viewportInteractionMediator);

new SelectionSaga(eventBus, textareaSelectionManager);
new RenderSaga(eventBus, commandBus);

commandBus.publish(new AddBlockCommand(BlockType.CreateBlock));
commandBus.publish(new ResizeDocumentCommand(new Dimensions(window.innerWidth, window.innerHeight)));
