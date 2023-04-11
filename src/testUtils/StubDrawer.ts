import { Drawer, RenderTextOptions } from '../commands/render/RenderService';

export class StubDrawer implements Drawer {
  /**
   * @param options @type {RenderTextOptions}
   * @returns {number} height of the rendered text
   */
  renderText({ lineHeight, padding: [verticalPadding] }: RenderTextOptions): number {
    return verticalPadding * 2 + lineHeight;
  }
}
