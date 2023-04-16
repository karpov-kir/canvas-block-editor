import { Drawer, RenderTextOptions } from '../commands/render/RenderService';

export class StubDrawer implements Drawer {
  text = jest.fn(({ lineHeight, padding, margin }: RenderTextOptions) => {
    return lineHeight + padding.vertical * 2 + margin.vertical * 2;
  });
  setViewportSize = jest.fn();
  clear = jest.fn();
  rect = jest.fn();
}
