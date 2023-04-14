import { Drawer, RenderTextOptions } from '../commands/render/RenderService';

export class StubDrawer implements Drawer {
  /**
   * @param options @type {RenderTextOptions}
   * @returns {number} height of the rendered text
   */
  renderText({ lineHeight, padding }: RenderTextOptions): number {
    return padding.vertical * 2 + lineHeight;
  }
}
