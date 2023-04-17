import { Margin, Padding } from '../../stores/BlockRectStore';
import { Dimensions } from '../../utils/math/Dimensions';
import { Drawer, RenderRectOptions, RenderTextOptions } from './RenderService';

export class CanvasDrawer implements Drawer {
  constructor(private readonly context: CanvasRenderingContext2D) {}

  /**
   * @param options @type {RenderTextOptions}
   * @returns {number} height of the rendered text
   */
  text({ x, y, fontFamily, width, fontSize, lineHeight, text, padding, margin }: RenderTextOptions): number {
    // TODO maybe use a pub/sub to notify about the new lines and render them on the fly?
    const { lines, lineMetrics, box } = fitTextIntoWidth(this.context, {
      width,
      text,
      fontSize,
      lineHeight,
      fontFamily,
      padding,
      margin,
    });

    this.context.fillStyle = 'black';
    this.context.font = `${fontSize}px ${fontFamily}`;
    this.context.textAlign = 'left';
    this.context.textBaseline = 'top';

    lines.forEach((line, index) => {
      const currentLineMetrics = lineMetrics[index];
      this.context.fillText(
        line,
        x + padding.horizontal + margin.horizontal,
        y + currentLineMetrics.topOffset + box.lineHeightOffset + padding.vertical + margin.vertical,
      );
    });

    return box.height;
  }

  rect({ x, y, width, height, fill, strokeStyle }: RenderRectOptions) {
    this.context.beginPath();
    this.context.strokeStyle = strokeStyle;
    this.context.rect(x, y, width, height);

    if (fill) {
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

// TODO is built-in `TextMetrics` useful?
interface LineMetrics {
  width: number;
  topOffset: number;
}

interface FitTextResultIntoWidthResult {
  box: {
    textWidth: number;
    width: number;
    textHeight: number;
    height: number;
    lineHeightOffset: number;
  };
  lineMetrics: LineMetrics[];
  lines: string[];
}

export const fitTextIntoWidth = (
  canvasContext: CanvasRenderingContext2D,
  options: FitTextIntoWidthOptions,
): FitTextResultIntoWidthResult => {
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
  const height = textHeight + padding.vertical * 2 + margin.vertical * 2;

  return {
    lines,
    lineMetrics,
    box: {
      textWidth,
      width,
      height,
      textHeight,
      lineHeightOffset: lineHeight - fontSize,
    },
  };
};
