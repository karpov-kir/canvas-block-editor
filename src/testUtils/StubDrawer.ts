import { Drawer, RenderTextOptions } from '../commands/render/RenderService';
import { Dimensions } from '../math/Dimensions';

export class StubDrawer implements Drawer {
  /**
   * @param options @type {RenderTextOptions}
   * @returns {number} height of the rendered text
   */
  renderText({ lineHeight, padding }: RenderTextOptions): number {
    return padding.vertical * 2 + lineHeight;
  }

  setViewportSize(_dimensions: Dimensions): void {
    return undefined;
  }
}
