import { Dimensions } from './math/Dimensions';
import { Rectangle } from './math/Rectangle';
import { Vector } from './math/Vector';

export class Padding {
  constructor(public vertical: number = 0, public horizontal: number = 0) {}
}

export class BlockRect extends Rectangle {
  constructor(
    public blockId: number,
    public padding = new Padding(),
    position = new Vector(),
    dimensions = new Dimensions(),
  ) {
    super(position, dimensions);
  }
}

export class BlockRectStore {
  public readonly blockRects: Map<number, BlockRect> = new Map();

  public attach(blockId: number, blockRect: BlockRect) {
    this.blockRects.set(blockId, blockRect);
  }

  public detach(blockId: number) {
    this.blockRects.delete(blockId);
  }
}
