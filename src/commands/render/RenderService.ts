import { Dimensions } from '../../math/Dimensions';
import { Vector } from '../../math/Vector';
import { BlockRect, BlockRectStore, Padding } from '../../stores/BlockRectStore';
import { BlockStore, BlockType } from '../../stores/BlockStore';

export interface RenderTextOptions {
  x: number;
  y: number;
  width: number;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  text: string;
  padding: Padding;
}

export interface Drawer {
  renderText(options: RenderTextOptions): number;
  setViewportSize(dimensions: Dimensions): void;
  clear(): void;
}

const defaultStyles = {
  fontFamily: 'Arial',
  fontSize: 16,
  lineHeight: 20,
  width: 100,
  padding: new Padding(5, 5),
};

export class RenderService {
  constructor(
    private readonly drawer: Drawer,
    private readonly blockStore: BlockStore,
    private readonly blockReactStore: BlockRectStore,
  ) {}

  render() {
    this.drawer.clear();

    let nextY = 0;
    this.blockStore.blocks.forEach((block) => {
      const blockHeight = this.drawer.renderText({
        ...defaultStyles,
        x: 0,
        y: nextY,
        text: block.type === BlockType.CreateBlock ? 'New +' : block.content,
      });

      this.blockReactStore.attach(
        block.id,
        new BlockRect(
          block.id,
          new Padding(5, 5),
          new Vector(0, nextY),
          new Dimensions(defaultStyles.width, blockHeight),
        ),
      );

      nextY += blockHeight + 1;
    });
  }
}
