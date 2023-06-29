import {
  ClearRectOptions,
  Drawer,
  RenderCarriageOptions,
  RenderCarriageResult,
  RenderRectOptions,
  RenderSelectionOptions,
  RenderTextContentRectOptions,
  RenderTextOptions,
} from '../../commands/render/RenderService';
import { ContentRect } from '../../stores/BlockRectStore';
import { Dimensions } from '../../utils/math/Dimensions';
import { Vector } from '../../utils/math/Vector';
import { createContentRect } from './createContentRect';

class BlinkingCarriageDrawer implements RenderCarriageResult {
  private isShown = true;
  private scheduledBlinkTimeoutId?: NodeJS.Timeout;

  constructor(
    private readonly drawer: Drawer,
    private readonly canvasContext: CanvasRenderingContext2D,
    private options: RenderCarriageOptions,
  ) {
    this.render();
    this.scheduleBlink();
  }

  private unscheduleBlink() {
    this.isShown = true;
    clearTimeout(this.scheduledBlinkTimeoutId);
    this.scheduledBlinkTimeoutId = undefined;
  }

  private scheduleBlink() {
    if (this.scheduledBlinkTimeoutId) {
      return;
    }

    this.scheduledBlinkTimeoutId = setTimeout(() => {
      this.scheduledBlinkTimeoutId = undefined;
      this.isShown = !this.isShown;
      this.render();
      this.scheduleBlink();
    }, 500);
  }

  private render() {
    let lastCharacterIndex = 0;
    const { lines, carriagePosition, contentStartPosition, lineHeight } = this.options;

    lines.forEach((line, lineIndex) => {
      const isCarriageInLine =
        carriagePosition > lastCharacterIndex && carriagePosition <= lastCharacterIndex + line.length;

      if (isCarriageInLine) {
        const characterCountBeforeCarriageInLine = carriagePosition - lastCharacterIndex;
        const charactersBeforeCarriageInLine = lines[lineIndex].slice(0, characterCountBeforeCarriageInLine);
        const { width } = this.canvasContext.measureText(charactersBeforeCarriageInLine);
        const position = new Vector(contentStartPosition.x + width, contentStartPosition.y + lineHeight * lineIndex);
        const dimensions = new Dimensions(1, lineHeight);

        if (this.isShown) {
          this.drawer.rect({
            position,
            dimensions,
            fill: true,
            strokeStyle: 'transparent',
            fillStyle: 'black',
          });
        } else {
          this.drawer.clearRect({
            position,
            dimensions,
          });
        }
      }

      lastCharacterIndex += line.length;
    });
  }

  public stopBlinking() {
    this.unscheduleBlink();
  }

  public update(newOptions: RenderCarriageOptions) {
    this.options = newOptions;

    this.unscheduleBlink();
    this.render();
    this.scheduleBlink();
  }
}

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

  clearRect({ position, dimensions }: ClearRectOptions) {
    this.canvasContext.clearRect(position.x, position.y, dimensions.width, dimensions.height);
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

    lines.forEach((line, lineIndex) => {
      const currentLineMetrics = lineMetrics[lineIndex];

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

  selection({ lineHeight, lines, selection, contentStartPosition }: RenderSelectionOptions) {
    let selectedLineCount = 0;
    let lastCharacterIndex = 0;

    // TODO break whenever selection is rendered
    lines.forEach((line, lineIndex) => {
      const { start: absoluteSelectionStart, end: absoluteSelectionEnd } = selection;
      const absoluteLineStart = lastCharacterIndex;
      const absoluteLineEnd = absoluteLineStart + line.length;

      const selectionStartInLine = Math.max(absoluteSelectionStart - absoluteLineStart, 0);
      const absoluteSelectionEndInLine = Math.min(absoluteSelectionEnd, absoluteLineEnd);
      const selectionEndInLine = absoluteSelectionEndInLine - absoluteLineStart;
      const selectedCharacterCountInLine = selectionEndInLine - selectionStartInLine;

      if (selectedCharacterCountInLine > 0) {
        const charactersToSelectInLine = line.slice(selectionStartInLine, selectionEndInLine);
        const { width } = this.canvasContext.measureText(charactersToSelectInLine);
        let selectionOffsetX = 0;

        if (selectedLineCount === 0) {
          ({ width: selectionOffsetX } = this.canvasContext.measureText(line.slice(0, selectionStartInLine)));
        }

        selectedLineCount += 1;

        this.rect({
          position: new Vector(
            contentStartPosition.x + selectionOffsetX,
            contentStartPosition.y + lineHeight * lineIndex,
          ),
          dimensions: new Dimensions(width, lineHeight),
          fill: true,
          strokeStyle: 'transparent',
          fillStyle: 'rgba(0, 0, 255, 0.2)',
        });
      }

      lastCharacterIndex += line.length;
    });
  }

  carriage(options: RenderCarriageOptions): RenderCarriageResult {
    return new BlinkingCarriageDrawer(this, this.canvasContext, options);
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
