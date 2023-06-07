import { Drawer, RenderTextContentRectOptions } from '../commands/render/RenderService';
import { ContentRect } from '../stores/BlockRectStore';
import { Dimensions } from '../utils/math/Dimensions';
import { Vector } from '../utils/math/Vector';
import { longContent, longContentLines } from './mothers/BlockMother';

export class StubDrawer implements Drawer {
  textContentRect = jest.fn(
    ({ lineHeight, padding, margin, width, position, fontFamily, fontSize, text }: RenderTextContentRectOptions) => {
      const contentWidth = width - padding.horizontal * 2 - margin.horizontal * 2;
      const contentX = position.x + padding.horizontal + margin.horizontal;
      const contentY = position.y + padding.vertical + margin.vertical;
      const lines = text === longContent ? longContentLines : [text];
      const contentHeight = lineHeight * lines.length;
      const lineMetrics = lines.map((line, lineIndex) => {
        return { width: contentWidth, topOffset: lineIndex === 0 ? 0 : lineIndex * lineHeight + 1 };
      });
      const contentRect = new ContentRect(new Vector(contentX, contentY), new Dimensions(contentWidth, contentHeight));

      contentRect.fontFamily = fontFamily;
      contentRect.lineHeight = lineHeight;
      contentRect.fontSize = fontSize;
      contentRect.lines = lines;
      contentRect.lineMetrics = lineMetrics;

      return contentRect;
    },
  );
  text = jest.fn();
  setViewportSize = jest.fn();
  clear = jest.fn();
  rect = jest.fn();
  clearRect = jest.fn();
  carriage = jest.fn();
  selection = jest.fn();
}
