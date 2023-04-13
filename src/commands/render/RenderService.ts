import { Dimensions } from '../../math/Dimensions';
import { Vector } from '../../math/Vector';
import { BlockRect, BlockRectStore, Padding } from '../../stores/BlockRectStore';
import { Block } from '../../stores/BlockStore';

export interface RenderTextOptions {
  x: number;
  y: number;
  maxWidth: number;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  text: string;
  padding: [vertical: number, horizontal: number];
}

export interface Drawer {
  renderText(options: RenderTextOptions): number;
}

export class RenderService {
  constructor(private readonly drawer: Drawer, private readonly blockReactStore: BlockRectStore) {}

  render(blocks: Map<number, Block>) {
    let nextY = 0;
    const fontFamily = 'Arial';
    const fontSize = 16;
    const lineHeight = 20;
    const blockWidth = 100;

    blocks.forEach((block) => {
      const blockHeight = this.drawer.renderText({
        x: 0,
        y: nextY,
        maxWidth: blockWidth,
        fontFamily,
        fontSize,
        lineHeight,
        text: block.content,
        padding: [5, 5],
      });

      this.blockReactStore.attach(
        block.id,
        new BlockRect(block.id, new Padding(5, 5), new Vector(0, nextY), new Dimensions(blockWidth, blockHeight)),
      );

      nextY += blockHeight + 1;
    });
  }
}
