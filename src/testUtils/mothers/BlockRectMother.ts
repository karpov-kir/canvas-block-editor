import { BlockRect, Padding } from '../../BlockRectStore';
import { createIdGenerator } from '../../idGenerator';
import { Dimensions } from '../../math/Dimensions';
import { Builder } from './Builder';
import { ObjectMother } from './ObjectMother';

class BlockRectBuilder extends Builder<BlockRect> {
  private blockIdGenerator = createIdGenerator();

  public instance = this.createEmpty();

  public createEmpty(): BlockRect {
    return new BlockRect(this.blockIdGenerator());
  }

  public setPadding(padding: Padding) {
    this.instance.padding = padding;
    return this;
  }

  public setDimensions(dimensions: Dimensions) {
    this.instance.dimensions = dimensions;
    return this;
  }

  public setHeight(height: number) {
    this.instance.dimensions.height = height;
    return this;
  }

  public setX(x: number) {
    this.instance.position.x = x;
    return this;
  }

  public setY(y: number) {
    this.instance.position.y = y;
    return this;
  }

  public setBlockId(blockId: number) {
    this.instance.blockId = blockId;
    return this;
  }
}

export class BlockRectMother extends ObjectMother<BlockRectBuilder> {
  public readonly builder = new BlockRectBuilder();

  public withSmallSize() {
    this.builder.setDimensions(new Dimensions(100, 30)).setPadding(new Padding(5, 5));
    return this;
  }
}
