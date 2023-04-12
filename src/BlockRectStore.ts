interface Position {
  x: number;
  y: number;
}

interface BlockRect {
  blockId: number;
  position: Position;
  padding: [vertical: number, horizontal: number];
  width: number;
  height: number;
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
