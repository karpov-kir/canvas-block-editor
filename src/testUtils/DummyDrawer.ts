import { Drawer, RenderTextOptions } from '../commands/render/RenderService';

export class DummyDrawer implements Drawer {
  renderText({ fontSize, lineHeight }: RenderTextOptions): number {
    return fontSize * lineHeight;
  }
}
