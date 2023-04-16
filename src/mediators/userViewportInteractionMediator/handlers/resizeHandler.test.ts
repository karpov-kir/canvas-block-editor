import { ResizeDocumentCommand } from '../../../commands/resizeDocument/ResizeDocumentCommand';
import { DocumentStore } from '../../../stores/DocumentStore';
import { CommandHandlerStub } from '../../../testUtils/CommandHandlerStub';
import { Dimensions } from '../../../utils/math/Dimensions';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { resizeHandler } from './resizeHandler';

describe(resizeHandler, () => {
  let commandBus: CommandBus;
  let documentStore: DocumentStore;

  beforeEach(() => {
    commandBus = new CommandBus();
    documentStore = new DocumentStore();
  });

  it(`emits the ${ResizeDocumentCommand.name} on document resize`, () => {
    const resizeCommandHandler = new CommandHandlerStub();

    commandBus.subscribe(ResizeDocumentCommand, resizeCommandHandler);
    resizeHandler(new UIEvent('resize'), documentStore, commandBus);

    expect(resizeCommandHandler.execute).toBeCalledWith(expect.any(ResizeDocumentCommand));
  });

  it(`does not emit the ${ResizeDocumentCommand.name} on document to the same dimensions`, () => {
    const resizeCommandHandler = new CommandHandlerStub();

    documentStore.dimensions = new Dimensions(200, 200);

    commandBus.subscribe(ResizeDocumentCommand, resizeCommandHandler);
    resizeHandler(new UIEvent('resize'), documentStore, commandBus);

    expect(resizeCommandHandler.execute).not.toBeCalledWith();
  });
});
