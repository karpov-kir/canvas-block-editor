import { ResizeDocumentCommand } from '../../../commands/resizeDocument/ResizeDocumentCommand';
import { DocumentStore } from '../../../stores/DocumentStore';
import { FakeHandlerStub } from '../../../testUtils/FakeCommandHandler';
import { Dimensions } from '../../../utils/math/Dimensions';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { ViewportInteractionResizeEvent } from '../ViewportInteractionMediator';
import { resizeHandler } from './resizeHandler';

describe(resizeHandler, () => {
  let commandBus: CommandBus;
  let documentStore: DocumentStore;

  beforeEach(() => {
    commandBus = new CommandBus();
    documentStore = new DocumentStore();
  });

  it(`emits the ${ResizeDocumentCommand.name} on document resize`, () => {
    const resizeCommandHandler = new FakeHandlerStub();

    commandBus.subscribe(ResizeDocumentCommand, resizeCommandHandler);
    resizeHandler(new ViewportInteractionResizeEvent(new Dimensions(100, 100)), documentStore, commandBus);

    expect(resizeCommandHandler.execute).toBeCalledWith(expect.any(ResizeDocumentCommand));
  });

  it(`does not emit the ${ResizeDocumentCommand.name} on document resize to the same dimensions as stored currently`, () => {
    const resizeCommandHandler = new FakeHandlerStub();

    documentStore.dimensions = new Dimensions(200, 200);

    commandBus.subscribe(ResizeDocumentCommand, resizeCommandHandler);
    resizeHandler(new ViewportInteractionResizeEvent(new Dimensions(200, 200)), documentStore, commandBus);

    expect(resizeCommandHandler.execute).not.toBeCalledWith();
  });
});
