import { ContentRect } from '../../../stores/BlockRectStore';
import { Dimensions } from '../../../utils/math/Dimensions';
import { Vector } from '../../../utils/math/Vector';
import { Drawer, RenderRectOptions, RenderTextOptions } from '../RenderService';
import { fitTextIntoWidth } from './fitTextIntoWidth';

export class CanvasDrawer implements Drawer {
  constructor(private readonly context: CanvasRenderingContext2D) {}

  text({
    position,
    fontFamily,
    width,
    fontSize,
    lineHeight,
    text,
    padding,
    margin,
    selection,
  }: RenderTextOptions): ContentRect {
    // TODO maybe use a pub/sub to notify about the new lines and render them on the fly?
    const fitTextIntoWidthResult = fitTextIntoWidth(this.context, {
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

    const { lines, lineMetrics, lineHeightOffset } = contentRect;

    let lastCharacterIndex = 0;
    let characterCountToSelectLeft = selection ? selection.end - selection.start : 0;
    let selectedLineCount = 0;
    lines.forEach((line, lineIndex) => {
      const currentLineMetrics = lineMetrics[lineIndex];

      if (
        selection &&
        (selection.start >= lastCharacterIndex || selection.end >= lastCharacterIndex) &&
        characterCountToSelectLeft > 0
      ) {
        const { start, end } = selection;
        let charactersToSelect: string;
        let offsetWidth = 0;

        if (selectedLineCount === 0) {
          charactersToSelect = line.slice(start, end);
          ({ width: offsetWidth } = this.context.measureText(line.slice(0, start)));
        } else {
          charactersToSelect = line.slice(0, characterCountToSelectLeft);
        }

        characterCountToSelectLeft -= charactersToSelect.length;
        selectedLineCount += 1;

        const { width } = this.context.measureText(charactersToSelect);

        this.rect({
          position: new Vector(contentRect.position.x + offsetWidth, contentRect.position.y + lineHeight * lineIndex),
          dimensions: new Dimensions(width, lineHeight),
          fill: true,
          strokeStyle: 'transparent',
          fillStyle: 'rgba(0, 0, 255, 0.2)',
        });
      }

      lastCharacterIndex += line.length;

      this.context.fillStyle = 'black';
      this.context.font = `${fontSize}px ${fontFamily}`;
      this.context.textAlign = 'left';
      this.context.textBaseline = 'top';
      this.context.fillText(
        line,
        contentRect.position.x,
        contentRect.position.y + currentLineMetrics.topOffset + lineHeightOffset,
      );
    });

    return contentRect;
  }

  rect({ position, dimensions, fill, strokeStyle, fillStyle }: RenderRectOptions) {
    this.context.beginPath();
    this.context.strokeStyle = strokeStyle;
    this.context.rect(position.x, position.y, dimensions.width, dimensions.height);

    if (fill) {
      if (fillStyle) {
        this.context.fillStyle = fillStyle;
      }

      this.context.fill();
    }

    this.context.stroke();
  }

  setViewportSize({ width, height }: Dimensions) {
    this.context.canvas.width = width;
    this.context.canvas.height = height;
    this.context.canvas.style.width = `${width}px`;
    this.context.canvas.style.height = `${height}px`;
  }

  clear() {
    this.context.save();
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    this.context.restore();
  }
}
