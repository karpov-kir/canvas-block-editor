import { Dimensions } from '../../math/Dimensions';
import { DocumentStore } from '../../stores/DocumentStore';
import { StubDrawer } from '../../testUtils/StubDrawer';
import { ResizeDocumentService } from './ResizeDocumentService';

describe(ResizeDocumentService, () => {
  it('update dimensions', () => {
    const drawer = new StubDrawer();
    const documentStore = new DocumentStore();
    const resizeDocumentService = new ResizeDocumentService(drawer, documentStore);

    jest.spyOn(drawer, 'setViewportSize');

    resizeDocumentService.updateDimensions(new Dimensions(100, 100));

    expect(drawer.setViewportSize).toBeCalledWith(new Dimensions(100, 100));
    expect(documentStore.dimensions).toEqual(new Dimensions(100, 100));
  });
});
