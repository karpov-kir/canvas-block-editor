import { AddBlockCommand } from './commands/addBlock/AddBlockCommand';
import { AddBlockCommandHandler } from './commands/addBlock/AddBlockCommandHandler';
import { ChangeBlockTypeCommand } from './commands/changeBlockType/ChangeBlockTypeCommand';
import { ChangeBlockTypeCommandHandler } from './commands/changeBlockType/ChangeBlockTypeCommandHandler';
import { FocusBlockCommand } from './commands/focusBlock/FocusBlockCommand';
import { FocusBlockCommandHandler } from './commands/focusBlock/FocusBlockCommandHandler';
import { HighlightBlockCommand } from './commands/highlightBlock/HighlightBlockCommand';
import { HighlightBlockCommandHandler } from './commands/highlightBlock/HighlightBlockCommandHandler';
import { InputCommand } from './commands/input/InputCommand';
import { InputCommandHandler } from './commands/input/InputCommandHandler';
import { MoveCarriageCommand } from './commands/moveCarriage/MoveCarriageCommand';
import { MoveCarriageCommandHandler } from './commands/moveCarriage/MoveCarriageCommandHandler';
import { RemoveFocusFromBlockCommand } from './commands/removeFocusFromBlock/RemoveFocusFromBlockCommand';
import { RemoveFocusFromBlockCommandHandler } from './commands/removeFocusFromBlock/RemoveFocusFromBlockCommandHandler';
import { RemoveHighlightFromBlockCommand } from './commands/removeHighlightFromBlock/RemoveHighlightFromBlockCommand';
import { RemoveHighlightFromBlockCommandHandler } from './commands/removeHighlightFromBlock/RemoveHighlightFromBlockCommandHandler';
import { CanvasDrawer } from './commands/render/CanvasDrawer/CanvasDrawer';
import { RenderCommand } from './commands/render/RenderCommand';
import { RenderCommandHandler } from './commands/render/RenderCommandHandler';
import { RenderService } from './commands/render/RenderService';
import { ResizeDocumentCommand } from './commands/resizeDocument/ResizeDocumentCommand';
import { ResizeDocumentCommandHandler } from './commands/resizeDocument/ResizeDocumentCommandHandler';
import { ResizeDocumentService } from './commands/resizeDocument/ResizeDocumentService';
import { SelectCommand } from './commands/select/SelectCommand';
import { SelectCommandHandler } from './commands/select/SelectCommandHandler';
import { CursorInteractionMediator } from './mediators/cursorInteractionMediator/CursorInteractionMediator';
import { subscribeToCursorInteraction } from './mediators/cursorInteractionMediator/subscribeToCursorInteraction';
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

commandBus.subscribe(AddBlockCommand, new AddBlockCommandHandler(blockStore, eventBus));
commandBus.subscribe(ChangeBlockTypeCommand, new ChangeBlockTypeCommandHandler(blockStore, eventBus));
commandBus.subscribe(FocusBlockCommand, new FocusBlockCommandHandler(blockStore, eventBus));
commandBus.subscribe(RemoveFocusFromBlockCommand, new RemoveFocusFromBlockCommandHandler(blockStore, eventBus));
commandBus.subscribe(HighlightBlockCommand, new HighlightBlockCommandHandler(blockStore, eventBus));
commandBus.subscribe(InputCommand, new InputCommandHandler(blockStore, eventBus));
commandBus.subscribe(MoveCarriageCommand, new MoveCarriageCommandHandler(blockStore, eventBus));
commandBus.subscribe(RemoveHighlightFromBlockCommand, new RemoveHighlightFromBlockCommandHandler(blockStore, eventBus));
commandBus.subscribe(ResizeDocumentCommand, new ResizeDocumentCommandHandler(resizeDocumentService, eventBus));
commandBus.subscribe(SelectCommand, new SelectCommandHandler(blockStore, eventBus));
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
