import { BlockRect, Margin, Padding } from '../../stores/BlockRectStore';
import { createIdGenerator } from '../../utils/idGenerator';
import { Dimensions } from '../../utils/math/Dimensions';
import { content, longContent } from './BlockMother';
import { Builder } from './Builder';
import { ObjectMother } from './ObjectMother';

class BlockRectBuilder extends Builder<BlockRect> {
  private blockIdGenerator = createIdGenerator();

  private updateContentRect() {
    const { padding, margin, contentRect, position, dimensions } = this.instance;

    contentRect.position.x = position.x + padding.horizontal + margin.horizontal;
    contentRect.position.y = position.y + padding.vertical + margin.vertical;

    contentRect.dimensions.width = dimensions.width - padding.horizontal * 2 - margin.horizontal * 2;
    contentRect.dimensions.height = dimensions.height - padding.vertical * 2 - margin.vertical * 2;
  }

  public override instance = this.createEmpty();

  public override createEmpty(): BlockRect {
    return new BlockRect(this.blockIdGenerator());
  }

  public setPadding(padding: Padding) {
    this.instance.padding = padding;

    this.updateContentRect();

    return this;
  }

  public setMargin(margin: Margin) {
    this.instance.margin = margin;
    return this;
  }

  public setDimensions(dimensions: Dimensions) {
    this.instance.dimensions = dimensions;

    this.updateContentRect();

    return this;
  }

  public setHeight(height: number) {
    this.instance.dimensions.height = height;

    this.updateContentRect();

    return this;
  }

  public setX(x: number) {
    this.instance.position.x = x;

    this.updateContentRect();

    return this;
  }

  public setY(y: number) {
    this.instance.position.y = y;

    this.updateContentRect();

    return this;
  }

  public setBlockId(blockId: number) {
    this.instance.blockId = blockId;
    return this;
  }
}

export class BlockRectMother extends ObjectMother<BlockRectBuilder> {
  public override readonly builder = new BlockRectBuilder();

  public withSmallSize() {
    this.builder
      .setDimensions(new Dimensions(100, 40))
      .setPadding(new Padding(5, 5))
      .setMargin(new Margin(5, 5))
      .setX(0)
      .setY(0);

    return this;
  }

  public withContent() {
    this.builder.instance.contentRect.lines = [content];
    this.builder.instance.contentRect.lineMetrics = [
      {
        width: 80,
        topOffset: 0,
      },
    ];

    return this;
  }

  public withLongContent() {
    this.builder.instance.contentRect.lines = [longContent];
    this.builder.instance.contentRect.lineMetrics = [
      {
        width: 80,
        topOffset: 0,
      },
    ];

    return this;
  }

  public underLast() {
    const last = this.last;
    this.builder.setX(last.position.x);
    this.builder.setY(last.position.y + last.dimensions.height + 1);
    return this;
  }
}
