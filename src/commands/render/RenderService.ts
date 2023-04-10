import { Block } from '../../BlockStore';

export interface RenderTextOptions {
  x: number;
  y: number;
  maxWidth: number;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  text: string;
}

export interface Drawer {
  renderText(options: RenderTextOptions): number;
}

export class RenderService {
  constructor(private readonly drawer: Drawer) {}

  render(blocks: Map<number, Block>) {
    let lastTopPosition = 0;
    const fontFamily = 'Arial';
    const fontSize = 16;
    const lineHeight = 1.5;
    const blockWidth = 100;

    blocks.forEach((block) => {
      const blockHeight = this.drawer.renderText({
        x: 0,
        y: lastTopPosition,
        maxWidth: blockWidth,
        fontFamily,
        fontSize,
        lineHeight,
        text: block.content,
      });

      lastTopPosition += blockHeight;
    });
  }
}
