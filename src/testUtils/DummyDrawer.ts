import { Drawer, RenderTextOptions } from '../commands/render/RenderService';

export class DummyDrawer implements Drawer {
  /**
   * @param options @type {RenderTextOptions}
   * @returns {number} height of the rendered text
   */
  renderText({ lineHeight, padding: [verticalPadding] }: RenderTextOptions): number {
    return verticalPadding + lineHeight;
  }
}
