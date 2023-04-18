import { Drawer, RenderTextOptions } from '../commands/render/RenderService';
import { ContentRect } from '../stores/BlockRectStore';
import { Dimensions } from '../utils/math/Dimensions';
import { Vector } from '../utils/math/Vector';

export class StubDrawer implements Drawer {
  text = jest.fn(({ lineHeight, padding, margin, width, position, fontFamily, fontSize, text }: RenderTextOptions) => {
    const contentWidth = width - padding.horizontal * 2 - margin.horizontal * 2;
    const contentX = position.x + padding.horizontal + margin.horizontal;
    const contentY = position.y + padding.vertical + margin.vertical;
    const contentHeight = lineHeight;

    const contentRect = new ContentRect(new Vector(contentX, contentY), new Dimensions(contentWidth, contentHeight));

    contentRect.fontFamily = fontFamily;
    contentRect.lineHeight = lineHeight;
    contentRect.fontSize = fontSize;
    contentRect.lines = [text];
    contentRect.lineMetrics = [{ width: contentWidth, topOffset: 0 }];

    return contentRect;
  });
  setViewportSize = jest.fn();
  clear = jest.fn();
  rect = jest.fn();
}
