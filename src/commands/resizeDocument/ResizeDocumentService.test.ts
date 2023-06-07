import { DocumentStore } from '../../stores/DocumentStore';
import { FakeDrawer } from '../../testUtils/FakeDrawer';
import { Dimensions } from '../../utils/math/Dimensions';
import { ResizeDocumentService } from './ResizeDocumentService';

describe(ResizeDocumentService.name, () => {
  it('updates dimensions', () => {
    const drawer = new FakeDrawer();
    const documentStore = new DocumentStore();
    const resizeDocumentService = new ResizeDocumentService(drawer, documentStore);

    resizeDocumentService.updateDimensions(new Dimensions(100, 100));

    expect(drawer.setViewportSize).toBeCalledWith(new Dimensions(100, 100));
    expect(documentStore.dimensions).toEqual(new Dimensions(100, 100));
  });
});
