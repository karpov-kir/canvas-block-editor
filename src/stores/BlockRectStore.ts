import { Dimensions } from '../utils/math/Dimensions';
import { isPointInside } from '../utils/math/isPointInside';
import { Rectangle } from '../utils/math/Rectangle';
import { Vector } from '../utils/math/Vector';

export class Padding {
  constructor(public vertical: number = 0, public horizontal: number = 0) {}
}

export class Margin {
  constructor(public vertical: number = 0, public horizontal: number = 0) {}
}

export class BlockRect extends Rectangle {
  constructor(
    public blockId: number,
    public padding = new Padding(),
    public margin = new Margin(),
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

  public findByPosition(position: Vector) {
    for (const blockRect of this.blockRects.values()) {
      if (isPointInside(position, blockRect)) {
        return blockRect;
      }
    }
  }

  public getById(blockId: number) {
    const blockRect = this.blockRects.get(blockId);

    if (!blockRect) {
      throw new Error(`BlockRect with id ${blockId} not found`);
    }

    return blockRect;
  }
}
