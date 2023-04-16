import { DocumentStore } from '../../stores/DocumentStore';
import { StubDrawer } from '../../testUtils/StubDrawer';
import { Dimensions } from '../../utils/math/Dimensions';
import { ResizeDocumentService } from './ResizeDocumentService';

describe(ResizeDocumentService, () => {
  it('update dimensions', () => {
    const drawer = new StubDrawer();
    const documentStore = new DocumentStore();
    const resizeDocumentService = new ResizeDocumentService(drawer, documentStore);

    resizeDocumentService.updateDimensions(new Dimensions(100, 100));

    expect(drawer.setViewportSize).toBeCalledWith(new Dimensions(100, 100));
    expect(documentStore.dimensions).toEqual(new Dimensions(100, 100));
  });
});
