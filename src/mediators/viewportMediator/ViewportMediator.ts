import { Dimensions } from '../../math/Dimensions';

interface DocumentEventData {
  dimensions: Dimensions;
}

export class DocumentEvent {
  constructor(public readonly type: string, public readonly data: DocumentEventData) {}
}
