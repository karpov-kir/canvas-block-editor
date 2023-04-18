import { BlockRect, Margin, Padding } from '../../stores/BlockRectStore';
import { createIdGenerator } from '../../utils/idGenerator';
import { Dimensions } from '../../utils/math/Dimensions';
import { content, longContent } from './BlockMother';
import { Builder } from './Builder';
import { ObjectMother } from './ObjectMother';

class BlockRectBuilder extends Builder<BlockRect> {
  private blockIdGenerator = createIdGenerator();

  private updateContentRect() {
    this.instance.contentRect.position.x =
      this.instance.position.x + this.instance.padding.horizontal + this.instance.margin.horizontal;
    this.instance.contentRect.position.y =
      this.instance.position.y + this.instance.padding.vertical + this.instance.margin.vertical;

    this.instance.contentRect.dimensions.width =
      this.instance.dimensions.width - this.instance.padding.horizontal * 2 - this.instance.margin.horizontal * 2;
    this.instance.contentRect.dimensions.height =
      this.instance.dimensions.height - this.instance.padding.vertical * 2 - this.instance.margin.vertical * 2;
  }

  public instance = this.createEmpty();

  public createEmpty(): BlockRect {
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
  public readonly builder = new BlockRectBuilder();

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
