import { Dimensions } from '../../math/Dimensions';
import { Vector } from '../../math/Vector';
import { BlockRect, BlockRectStore, Padding } from '../../stores/BlockRectStore';
import { Block } from '../../stores/BlockStore';

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
}

const defaultStyles = {
  fontFamily: 'Arial',
  fontSize: 16,
  lineHeight: 20,
  width: 100,
  padding: new Padding(5, 5),
};

export class RenderService {
  constructor(private readonly drawer: Drawer, private readonly blockReactStore: BlockRectStore) {}

  render(blocks: Map<number, Block>) {
    let nextY = 0;

    blocks.forEach((block) => {
      const blockHeight = this.drawer.renderText({
        ...defaultStyles,
        x: 0,
        y: nextY,
        text: block.content,
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
