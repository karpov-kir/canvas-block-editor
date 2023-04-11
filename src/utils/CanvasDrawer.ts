import { Drawer, RenderTextOptions } from '../commands/render/RenderService';

export class CanvasDrawer implements Drawer {
  constructor(private readonly context: CanvasRenderingContext2D) {}

  /**
   * @param options @type {RenderTextOptions}
   * @returns {number} height of the rendered text
   */
  renderText({ x, y, fontFamily, maxWidth, fontSize, lineHeight, text, padding }: RenderTextOptions): number {
    // TODO maybe use a pub/sub to notify about the new lines and render them on the fly?
    const {lines, lineMetrics, box} = fitTextIntoWidth(this.context, {
      width: maxWidth,
      text,
      fontSize,
      lineHeight,
      fontFamily,
      padding
    })
    const [horizontalPadding] = padding;

    this.context.fillStyle = 'black';
    this.context.font = `${fontSize}px ${fontFamily}`;
    this.context.textAlign = 'left';
    this.context.textBaseline = 'top';

    lines.forEach((line, index) => {
      const currentLineMetrics = lineMetrics[index]

      this.context.fillText(line, x + horizontalPadding, currentLineMetrics.topOffset);
    })

    return box.heightWithPaddings
  }
}

interface FitTextIntoWidthOptions {
  text: string;
  width: number

  fontFamily: string;
  lineHeight: number;
  fontSize: number;
  padding: [vertical: number, horizontal: number];
}

// TODO is built-in `TextMetrics` useful?
interface LineMetrics {
  width: number;
  topOffset: number;
}

interface FitTextResult {
  box: {
    width: number;
    widthWithPaddings: number;
    height: number;
    heightWithPaddings: number;
    lastLineWidth: number;
    lastLineTopOffset: number;
  };
  lineMetrics: LineMetrics[];
  lines: string[];
}

export const fitTextIntoWidth = (
  canvasContext: CanvasRenderingContext2D,
  options: FitTextIntoWidthOptions,
): FitTextResult => {
  const { fontFamily, fontSize, padding: [verticalPadding, horizontalPadding], lineHeight, text, width } = options;

  canvasContext.font = `${fontSize}px ${fontFamily}`;
  canvasContext.textAlign = 'left';
  canvasContext.textBaseline = 'top';

  const widthToFitText = width - (horizontalPadding * 2);
  const lines: string[] = [];
  const lineMetrics: LineMetrics[] = [];
  const characterCount = text.length;

  let biggestWidth = 0;
  let currentLineBuffer = '';
  let lastLineMetrics = {
    width: 0,
    topOffset: verticalPadding
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
      lines.push(currentLineBuffer);
      lineMetrics.push(lastLineMetrics);
      biggestWidth = Math.max(biggestWidth, lastLineMetrics.width);
      currentLineBuffer = '';
      lastLineMetrics = {
        width: 0,
        topOffset: lines.length * lineHeight + verticalPadding
      }

      // If the last character is the new line character it means,
      // that there won't be iterations anymore and we need to store
      // the last line as empty.
      if (isLastCharacter) {
        lines.push(currentLineBuffer);
        lineMetrics.push(lastLineMetrics);
      }
    } 
    // Measure line and store line if it's too long
    else {
      // TODO measure only words to reduce performance impact
      const currentLineBufferMetrics = {
        width: canvasContext.measureText(currentLineBuffer).width,
        topOffset: lines.length * lineHeight + verticalPadding
      }

      if (currentLineBufferMetrics.width > widthToFitText) {
        if (currentLineBuffer.length === 1) {
          lines.push(currentLineBuffer);
          lineMetrics.push(currentLineBufferMetrics);
        } else {
          lines.push(previousLineBuffer);
          lineMetrics.push(lastLineMetrics);
          i--;
        }

        currentLineBuffer = '';
        biggestWidth = Math.max(biggestWidth, lineMetrics[lineMetrics.length - 1].width);
        lastLineMetrics = {
          width: 0,
          topOffset: lines.length * lineHeight + verticalPadding
        };
      } else {
        lastLineMetrics = currentLineBufferMetrics;
      }
    }
  }

  if (currentLineBuffer) {
    lines.push(currentLineBuffer);
    lineMetrics.push({
      width: canvasContext.measureText(currentLineBuffer).width,
      topOffset: lines.length * lineHeight + verticalPadding
    });
  }

  const height = lines.length * lineHeight;
  const heightWithPaddings = height + verticalPadding * 2;

  return {
    lines,
    lineMetrics,
    box: {
      width: biggestWidth,
      widthWithPaddings: biggestWidth + horizontalPadding * 2,
      height,
      heightWithPaddings,
      lastLineWidth: lineMetrics[lineMetrics.length - 1]?.width || 0,
      lastLineTopOffset: verticalPadding + height - (lines.length ? lineHeight : 0),
    },
  };
};
