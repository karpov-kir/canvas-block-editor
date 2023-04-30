import { DocumentStore } from '../../stores/DocumentStore';
import { StubDrawer } from '../../testUtils/StubDrawer';
import { Dimensions } from '../../utils/math/Dimensions';
import { EventBus } from '../../utils/pubSub/EventBus';
import { ResizeDocumentCommand } from './ResizeDocumentCommand';
import { DocumentResizedEvent, ResizeDocumentCommandHandler } from './ResizeDocumentCommandHandler';
import { ResizeDocumentService } from './ResizeDocumentService';

describe(ResizeDocumentCommandHandler.name, () => {
  it(`resizes document and emits the ${DocumentResizedEvent.name}`, () => {
    const documentStore = new DocumentStore();
    const resizeDocumentService = new ResizeDocumentService(new StubDrawer(), documentStore);
    const eventBus = new EventBus();
    const documentResizedEventHandler = jest.fn();

    jest.spyOn(resizeDocumentService, 'updateDimensions');

    eventBus.subscribe(DocumentResizedEvent, documentResizedEventHandler);
    new ResizeDocumentCommandHandler(resizeDocumentService, eventBus).execute(
      new ResizeDocumentCommand(new Dimensions(100, 100)),
    );

    expect(resizeDocumentService.updateDimensions).toBeCalledWith(new Dimensions(100, 100));
    expect(documentStore.dimensions.width).toEqual(100);
    expect(documentStore.dimensions.height).toEqual(100);
    expect(documentResizedEventHandler).toBeCalledWith(new DocumentResizedEvent(new Dimensions(100, 100)));
  });
});
