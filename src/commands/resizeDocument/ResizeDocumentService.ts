import { DocumentStore } from '../../stores/DocumentStore';
import { Dimensions } from '../../utils/math/Dimensions';
import { Drawer } from '../render/RenderService';

export class ResizeDocumentService {
  constructor(private readonly drawer: Drawer, private readonly documentStore: DocumentStore) {}

  updateDimensions(dimensions: Dimensions) {
    this.drawer.setViewportSize(dimensions);
    this.documentStore.dimensions = dimensions;
  }
}
