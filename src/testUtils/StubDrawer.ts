import { Drawer, RenderTextOptions } from '../commands/render/RenderService';

export class StubDrawer implements Drawer {
  text = jest.fn(({ lineHeight, padding }: RenderTextOptions) => {
    return padding.vertical * 2 + lineHeight;
  });
  setViewportSize = jest.fn();
  clear = jest.fn();
  rect = jest.fn();
}
