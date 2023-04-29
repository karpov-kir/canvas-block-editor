import { LineMetrics, Margin, Padding } from '../../../stores/BlockRectStore';
import { Dimensions } from '../../../utils/math/Dimensions';

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

  function createNewLineBuffer() {
    currentLineBuffer = '';
    lastLineMetrics = {
      width: 0,
      topOffset: lines.length * lineHeight,
    };
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
      createNewLineBuffer();

      // If the last character is the new line character it means,
      // that there won't be iterations anymore and so let's store
      // the last line as empty so it can be rendered.
      if (isLastCharacter) {
        addLineAndMetrics(currentLineBuffer, lastLineMetrics);
      }
    }
    // Otherwise measure the current buffer and store it right before it gets too long
    else {
      // TODO maybe measure only words to reduce (possibly?) performance impact?
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

        createNewLineBuffer();
      } else {
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
