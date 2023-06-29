import { TextStyles } from '../../shared/TextStyles';

export function findCharacterIndexInLineByX(
  canvasContext: CanvasRenderingContext2D,
  x: number,
  line: string,
  textStyles: TextStyles,
) {
  let accumulatedWidth = 0;
  let latestCharacterWidth = 0;

  canvasContext.fillStyle = 'black';
  canvasContext.font = `${textStyles.fontSize}px ${textStyles.fontFamily}`;
  canvasContext.textAlign = 'left';
  canvasContext.textBaseline = 'top';

  for (let i = 0; i < line.length; i++) {
    const character = line[i];
    const characterWidth = canvasContext.measureText(character).width;
    latestCharacterWidth = characterWidth;

    if (x < accumulatedWidth + characterWidth / 2) {
      return i;
    }

    accumulatedWidth += characterWidth;
  }

  if (x > accumulatedWidth - latestCharacterWidth) {
    return line.length;
  }

  return 0;
}
