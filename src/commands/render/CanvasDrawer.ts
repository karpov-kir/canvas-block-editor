import { ContentRect, LineMetrics, Margin, Padding } from '../../stores/BlockRectStore';
import { Dimensions } from '../../utils/math/Dimensions';
import { Vector } from '../../utils/math/Vector';
import { Drawer, RenderRectOptions, RenderTextOptions } from './RenderService';

export class CanvasDrawer implements Drawer {
  constructor(private readonly context: CanvasRenderingContext2D) {}

  /**
   * @param options @type {RenderTextOptions}
   * @returns {number} height of the rendered text
   */
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

interface FitTextIntoWidthOptions {
  text: string;
  width: number;

  fontFamily: string;
  lineHeight: number;
  fontSize: number;
  padding: Padding;
  margin: Margin;
}

type FitTextIntoWidthResult = {
  lines: string[];
  lineMetrics: LineMetrics[];
  lineHeightOffset: number;
  dimensions: Dimensions;
};

export const fitTextIntoWidth = (
  canvasContext: CanvasRenderingContext2D,
  options: FitTextIntoWidthOptions,
): FitTextIntoWidthResult => {
  const { fontFamily, fontSize, padding, lineHeight, text, width, margin } = options;

  canvasContext.font = `${fontSize}px ${fontFamily}`;
  canvasContext.textAlign = 'left';
  canvasContext.textBaseline = 'top';

  const widthToFitText = width - padding.horizontal * 2 - margin.horizontal * 2;
  const lines: string[] = [];
  const lineMetrics: LineMetrics[] = [];
  const characterCount = text.length;

  let biggestWidth = 0;
  let currentLineBuffer = '';
  let lastLineMetrics = {
    width: 0,
    topOffset: 0,
  };

  function addLineAndMetrics(line: string, newLineMetrics: LineMetrics) {
    biggestWidth = Math.max(biggestWidth, newLineMetrics.width);
    lineMetrics.push(newLineMetrics);
    lines.push(line);
  }

  // Create an empty line if the text is empty
  if (text === '') {
    addLineAndMetrics(currentLineBuffer, lastLineMetrics);
  }

  for (let i = 0; i < characterCount; i++) {
    const character = text[i];
    const isLastCharacter = i === characterCount - 1;
    const previousLineBuffer = currentLineBuffer;
    const isNewLineCharacter = character === '\n';

    currentLineBuffer += character;

    // Store the current buffer on a new line character
    if (isNewLineCharacter) {
      addLineAndMetrics(currentLineBuffer, lastLineMetrics);
      currentLineBuffer = '';
      lastLineMetrics = {
        width: 0,
        topOffset: lines.length * lineHeight,
      };

      // If the last character is the new line character it means,
      // that there won't be iterations anymore and so let's store
      // the last line as empty so it can be rendered.
      if (isLastCharacter) {
        addLineAndMetrics(currentLineBuffer, lastLineMetrics);
      }
    }
    // Otherwise measure the current buffer and store it right before it gets too long
    else {
      // TODO maybe measure only words to reduce performance impact?
      const currentLineBufferMetrics = {
        width: canvasContext.measureText(currentLineBuffer).width,
        topOffset: lines.length * lineHeight,
      };

      // If the current buffer is too long, store the previous buffer
      if (currentLineBufferMetrics.width > widthToFitText) {
        // If the current buffer contains only one character then
        // there is no a buffer that less than the current one.
        // Let's store it.
        if (currentLineBuffer.length === 1) {
          addLineAndMetrics(currentLineBuffer, currentLineBufferMetrics);
        }
        // Otherwise store the previous buffer to fit into the width
        else {
          addLineAndMetrics(previousLineBuffer, lastLineMetrics);
          i--;
        }

        currentLineBuffer = '';
        lastLineMetrics = {
          width: 0,
          topOffset: lines.length * lineHeight,
        };
      }
      // Otherwise just add the character to the current buffer
      else {
        lastLineMetrics = currentLineBufferMetrics;
      }
    }
  }

  // Is there something left after iterations?
  if (currentLineBuffer) {
    addLineAndMetrics(currentLineBuffer, {
      width: canvasContext.measureText(currentLineBuffer).width,
      topOffset: lines.length * lineHeight,
    });
  }

  const textHeight = lines.length * lineHeight;
  const textWidth = biggestWidth;

  return {
    lines,
    lineMetrics,
    lineHeightOffset: lineHeight - fontSize,
    dimensions: new Dimensions(textWidth, textHeight),
  };
};
