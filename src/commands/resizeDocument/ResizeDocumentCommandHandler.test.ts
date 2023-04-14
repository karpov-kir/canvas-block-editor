import { Dimensions } from '../../math/Dimensions';
import { DocumentStore } from '../../stores/DocumentStore';
import { StubDrawer } from '../../testUtils/StubDrawer';
import { ResizeDocumentCommand } from './ResizeDocumentCommand';
import { ResizeDocumentCommandHandler } from './ResizeDocumentCommandHandler';
import { ResizeDocumentService } from './ResizeDocumentService';

describe(ResizeDocumentCommandHandler, () => {
  it('resizes document', () => {
    const documentStore = new DocumentStore();
    const resizeDocumentService = new ResizeDocumentService(new StubDrawer(), documentStore);
    const handler = new ResizeDocumentCommandHandler(resizeDocumentService);
    const command = new ResizeDocumentCommand(new Dimensions(100, 100));

    jest.spyOn(resizeDocumentService, 'updateDimensions');

    handler.execute(command);

    expect(resizeDocumentService.updateDimensions).toBeCalledWith(new Dimensions(100, 100));
    expect(documentStore.dimensions.width).toEqual(100);
    expect(documentStore.dimensions.height).toEqual(100);
  });
});
