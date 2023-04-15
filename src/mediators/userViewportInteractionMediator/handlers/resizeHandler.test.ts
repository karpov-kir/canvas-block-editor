import { ResizeDocumentCommand } from '../../../commands/resizeDocument/ResizeDocumentCommand';
import { Dimensions } from '../../../math/Dimensions';
import { DocumentStore } from '../../../stores/DocumentStore';
import { CommandHandlerStub } from '../../../testUtils/CommandHandlerStub';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { DocumentEvent } from '../UserViewportInteractionMediator';
import { resizeHandler } from './resizeHandler';

describe(resizeHandler, () => {
  let commandBus: CommandBus;
  let documentStore: DocumentStore;

  beforeEach(() => {
    commandBus = new CommandBus();
    documentStore = new DocumentStore();
  });

  it(`emits the ${ResizeDocumentCommand.name} on document resize`, () => {
    const documentEvent = new DocumentEvent('resize', {
      dimensions: new Dimensions(200, 200),
    });
    const resizeCommandHandler = new CommandHandlerStub();

    commandBus.subscribe(ResizeDocumentCommand, resizeCommandHandler);
    resizeHandler(documentEvent, documentStore, commandBus);

    expect(resizeCommandHandler.execute).toBeCalledWith(expect.any(ResizeDocumentCommand));
  });

  it(`does not emit the ${ResizeDocumentCommand.name} on document to the same dimensions`, () => {
    const documentEvent = new DocumentEvent('resize', {
      dimensions: new Dimensions(200, 200),
    });
    const resizeCommandHandler = new CommandHandlerStub();

    documentStore.dimensions = new Dimensions(200, 200);

    commandBus.subscribe(ResizeDocumentCommand, resizeCommandHandler);
    resizeHandler(documentEvent, documentStore, commandBus);

    expect(resizeCommandHandler.execute).not.toBeCalledWith();
  });
});
