import { ContentRect, Margin, Padding } from '../../../stores/BlockRectStore';
import { Vector } from '../../../utils/math/Vector';
import { fitTextIntoWidth } from './fitTextIntoWidth';

interface CreateContentOptions {
  position: Vector;
  fontFamily: string;
  fontSize: number;
  padding: Padding;
  margin: Margin;
  lineHeight: number;
  width: number;
  text: string;
}

export function createContentRect(
  canvasContext: CanvasRenderingContext2D,
  { position, fontFamily, fontSize, padding, margin, lineHeight, width, text }: CreateContentOptions,
) {
  const fitTextIntoWidthResult = fitTextIntoWidth(canvasContext, {
    width,
    text,
    fontSize,
    lineHeight,
    fontFamily,
    padding,
    margin,
  });
  const contentRect = new ContentRect(
    new Vector(position.x + padding.vertical + margin.horizontal, position.y + padding.vertical + margin.vertical),
    fitTextIntoWidthResult.dimensions,
  );

  contentRect.fontFamily = fontFamily;
  contentRect.fontSize = fontSize;
  contentRect.lineHeight = lineHeight;
  contentRect.lines = fitTextIntoWidthResult.lines;
  contentRect.lineMetrics = fitTextIntoWidthResult.lineMetrics;

  return contentRect;
}
