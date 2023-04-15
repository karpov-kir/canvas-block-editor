import { Dimensions } from '../../math/Dimensions';
import { Padding } from '../../stores/BlockRectStore';
import { Drawer, RenderRectOptions, RenderTextOptions } from './RenderService';

export class CanvasDrawer implements Drawer {
  constructor(private readonly context: CanvasRenderingContext2D) {}

  /**
   * @param options @type {RenderTextOptions}
   * @returns {number} height of the rendered text
   */
  text({ x, y, fontFamily, width, fontSize, lineHeight, text, padding }: RenderTextOptions): number {
    // TODO maybe use a pub/sub to notify about the new lines and render them on the fly?
    const { lines, lineMetrics, box } = fitTextIntoWidth(this.context, {
      width,
      text,
      fontSize,
      lineHeight,
      fontFamily,
      padding,
    });

    this.context.fillStyle = 'black';
    this.context.font = `${fontSize}px ${fontFamily}`;
    this.context.textAlign = 'left';
    this.context.textBaseline = 'top';

    lines.forEach((line, index) => {
      const currentLineMetrics = lineMetrics[index];
      this.context.fillText(line, x + padding.horizontal, y + currentLineMetrics.topOffset + box.lineHeightOffset);
    });

    return box.heightWithPaddings;
  }

  rect({ x, y, width, height, fill }: RenderRectOptions) {
    this.context.beginPath();
    this.context.strokeStyle = 'red';
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
}

// TODO is built-in `TextMetrics` useful?
interface LineMetrics {
  width: number;
  topOffset: number;
}

interface FitTextResultIntoWidthResult {
  box: {
    width: number;
    widthWithPaddings: number;
    height: number;
    heightWithPaddings: number;
    lastLineWidth: number;
    lastLineTopOffset: number;
    lineHeightOffset: number;
  };
  lineMetrics: LineMetrics[];
  lines: string[];
}

export const fitTextIntoWidth = (
  canvasContext: CanvasRenderingContext2D,
  options: FitTextIntoWidthOptions,
): FitTextResultIntoWidthResult => {
  const { fontFamily, fontSize, padding, lineHeight, text, width } = options;

  canvasContext.font = `${fontSize}px ${fontFamily}`;
  canvasContext.textAlign = 'left';
  canvasContext.textBaseline = 'top';

  const widthToFitText = width - padding.horizontal * 2;
  const lines: string[] = [];
  const lineMetrics: LineMetrics[] = [];
  const characterCount = text.length;

  let biggestWidth = 0;
  let currentLineBuffer = '';
  let lastLineMetrics = {
    width: 0,
    topOffset: padding.vertical,
  };

  // Create an empty line if the text is empty
  if (text === '') {
    lines.push(currentLineBuffer);
    lineMetrics.push(lastLineMetrics);
  }

  for (let i = 0; i < characterCount; i++) {
    const character = text[i];
    const isLastCharacter = i === characterCount - 1;
    const previousLineBuffer = currentLineBuffer;

    currentLineBuffer += character;

    // Store line on new line character
    if (character === '\n') {
      lineMetrics.push(lastLineMetrics);
      lines.push(currentLineBuffer);
      biggestWidth = Math.max(biggestWidth, lastLineMetrics.width);
      currentLineBuffer = '';
      lastLineMetrics = {
        width: 0,
        topOffset: lines.length * lineHeight + padding.vertical,
      };

      // If the last character is the new line character it means,
      // that there won't be iterations anymore and we need to store
      // the last line as empty.
      if (isLastCharacter) {
        lineMetrics.push(lastLineMetrics);
        lines.push(currentLineBuffer);
      }
    }
    // Measure line and store line if it's too long
    else {
      // TODO measure only words to reduce performance impact
      const currentLineBufferMetrics = {
        width: canvasContext.measureText(currentLineBuffer).width,
        topOffset: lines.length * lineHeight + padding.vertical,
      };

      if (currentLineBufferMetrics.width > widthToFitText) {
        if (currentLineBuffer.length === 1) {
          lineMetrics.push(currentLineBufferMetrics);
          lines.push(currentLineBuffer);
        } else {
          lineMetrics.push(lastLineMetrics);
          lines.push(previousLineBuffer);
          i--;
        }

        currentLineBuffer = '';
        lastLineMetrics = {
          width: 0,
          topOffset: lines.length * lineHeight + padding.vertical,
        };
      } else {
        lastLineMetrics = currentLineBufferMetrics;
      }
    }
  }

  if (currentLineBuffer) {
    lineMetrics.push({
      width: canvasContext.measureText(currentLineBuffer).width,
      topOffset: lines.length * lineHeight + padding.vertical,
    });
    lines.push(currentLineBuffer);
  }

  const height = lines.length * lineHeight;
  const heightWithPaddings = height + padding.vertical * 2;

  return {
    lines,
    lineMetrics,
    box: {
      width: biggestWidth,
      widthWithPaddings: biggestWidth + padding.horizontal * 2,
      height,
      heightWithPaddings,
      lineHeightOffset: (lineHeight - fontSize) / 2,
      lastLineWidth: lineMetrics[lineMetrics.length - 1]?.width || 0,
      lastLineTopOffset: padding.vertical + height - (lines.length ? lineHeight : 0),
    },
  };
};
