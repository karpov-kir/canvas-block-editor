import { Dimensions } from '../../math/Dimensions';
import { DocumentStore } from '../../stores/DocumentStore';
import { StubDrawer } from '../../testUtils/StubDrawer';
import { EventBus } from '../../utils/pubSub/EventBus';
import { ResizeDocumentCommand } from './ResizeDocumentCommand';
import { DocumentResizedEvent, ResizeDocumentCommandHandler } from './ResizeDocumentCommandHandler';
import { ResizeDocumentService } from './ResizeDocumentService';

describe(ResizeDocumentCommandHandler, () => {
  it(`resizes document and emits the ${DocumentResizedEvent}`, () => {
    const documentStore = new DocumentStore();
    const resizeDocumentService = new ResizeDocumentService(new StubDrawer(), documentStore);
    const eventBus = new EventBus();
    const handler = new ResizeDocumentCommandHandler(resizeDocumentService, eventBus);
    const command = new ResizeDocumentCommand(new Dimensions(100, 100));
    const documentResizedHandler = jest.fn();

    jest.spyOn(resizeDocumentService, 'updateDimensions');

    eventBus.subscribe(DocumentResizedEvent, documentResizedHandler);
    handler.execute(command);

    expect(resizeDocumentService.updateDimensions).toBeCalledWith(new Dimensions(100, 100));
    expect(documentStore.dimensions.width).toEqual(100);
    expect(documentStore.dimensions.height).toEqual(100);
    expect(documentResizedHandler).toBeCalledWith(new DocumentResizedEvent(new Dimensions(100, 100)));
  });
});
