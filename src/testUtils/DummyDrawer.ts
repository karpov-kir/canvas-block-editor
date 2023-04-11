import { Drawer, RenderTextOptions } from '../commands/render/RenderService';

export class DummyDrawer implements Drawer {
  renderText({ lineHeight, padding: [verticalPadding] }: RenderTextOptions): number {
    return verticalPadding + lineHeight;
  }
}
