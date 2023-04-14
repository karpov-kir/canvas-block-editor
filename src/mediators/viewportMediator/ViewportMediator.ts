import { Dimensions } from '../../math/Dimensions';
import { ExternalEvent } from '../../utils/ExternalEvent';

interface DocumentEventData {
  dimensions: Dimensions;
}

export class DocumentEvent extends ExternalEvent {
  constructor(public readonly type: string, public readonly data: DocumentEventData) {
    super();
  }
}
