import { Dimensions } from '../utils/math/Dimensions';
import { isPointInside } from '../utils/math/isPointInside';
import { Rectangle } from '../utils/math/Rectangle';
import { Vector } from '../utils/math/Vector';

// Padding is included into width and height
export class Padding {
  constructor(public vertical: number = 0, public horizontal: number = 0) {}
}

// Margin is included into width and height
export class Margin {
  constructor(public vertical: number = 0, public horizontal: number = 0) {}
}

export interface LineMetrics {
  width: number;
  topOffset: number;
}

export class ContentRect extends Rectangle {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;

  lineMetrics: LineMetrics[];
  lines: string[];

  public get lineHeightOffset() {
    return this.lineHeight - this.fontSize;
  }

  constructor(position = new Vector(), dimensions = new Dimensions()) {
    super(position, dimensions);

    this.fontSize = 16;
    this.fontFamily = 'Arial';
    this.lineHeight = 20;

    this.lineMetrics = [];
    this.lines = [];
  }
}

export class BlockRect extends Rectangle {
  constructor(
    public blockId: number,
    public padding = new Padding(),
    public margin = new Margin(),
    public contentRect = new ContentRect(),
    position = new Vector(),
    dimensions = new Dimensions(),
  ) {
    super(position, dimensions);

    const minWidth = padding.horizontal * 2 + margin.horizontal * 2;
    const minHeight = margin.vertical * 2 + margin.vertical * 2;

    if (dimensions.width < minWidth) {
      throw new Error('Width cannot be smaller than padding + margin');
    }

    if (dimensions.height < minHeight) {
      throw new Error('Height cannot be smaller than padding + margin');
    }
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
