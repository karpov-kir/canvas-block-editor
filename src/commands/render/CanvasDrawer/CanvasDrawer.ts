import { ContentRect } from '../../../stores/BlockRectStore';
import { Dimensions } from '../../../utils/math/Dimensions';
import { Vector } from '../../../utils/math/Vector';
import { Drawer, RenderRectOptions, RenderTextContentRectOptions, RenderTextOptions } from '../RenderService';
import { createContentRect } from './createContentRect';
import { DrawSelectionHelper } from './DrawSelectionHelper';

export class CanvasDrawer implements Drawer {
  constructor(private readonly canvasContext: CanvasRenderingContext2D) {}

  text({ fontSize, fontFamily, text, position }: RenderTextOptions) {
    this.canvasContext.fillStyle = 'black';
    this.canvasContext.font = `${fontSize}px ${fontFamily}`;
    this.canvasContext.textAlign = 'left';
    this.canvasContext.textBaseline = 'top';
    this.canvasContext.fillText(text, position.x, position.y);
  }

  rect({ position, dimensions, fill, strokeStyle, fillStyle }: RenderRectOptions) {
    this.canvasContext.beginPath();
    this.canvasContext.strokeStyle = strokeStyle;
    this.canvasContext.rect(position.x, position.y, dimensions.width, dimensions.height);

    if (fill) {
      if (fillStyle) {
        this.canvasContext.fillStyle = fillStyle;
      }

      this.canvasContext.fill();
    }

    this.canvasContext.stroke();
  }

  textContentRect({
    position,
    fontFamily,
    width,
    fontSize,
    lineHeight,
    text,
    padding,
    margin,
    selection,
  }: RenderTextContentRectOptions): ContentRect {
    // TODO maybe use a pub/sub to notify about the new lines and render them on the fly?
    const contentRect = createContentRect(this.canvasContext, {
      width,
      text,
      fontSize,
      lineHeight,
      fontFamily,
      padding,
      margin,
      position,
    });
    const { lines, lineMetrics, lineHeightOffset } = contentRect;
    const drawSelectionHelper = selection ? new DrawSelectionHelper(selection, this.canvasContext, this) : undefined;

    lines.forEach((line, lineIndex) => {
      const currentLineMetrics = lineMetrics[lineIndex];

      if (drawSelectionHelper) {
        drawSelectionHelper.processLineAndMaybeDrawSelection(contentRect);
      }

      this.text({
        fontSize,
        fontFamily,
        lineHeight,
        text: line,
        position: new Vector(
          contentRect.position.x,
          contentRect.position.y + currentLineMetrics.topOffset + lineHeightOffset,
        ),
      });
    });

    return contentRect;
  }

  setViewportSize({ width, height }: Dimensions) {
    this.canvasContext.canvas.width = width;
    this.canvasContext.canvas.height = height;
    this.canvasContext.canvas.style.width = `${width}px`;
    this.canvasContext.canvas.style.height = `${height}px`;
  }

  clear() {
    this.canvasContext.save();
    this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
    this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    this.canvasContext.restore();
  }
}
