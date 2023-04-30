import { ContentRect } from '../../../stores/BlockRectStore';
import { Dimensions } from '../../../utils/math/Dimensions';
import { Vector } from '../../../utils/math/Vector';
import { Selection } from '../../select/SelectCommand';
import { CanvasDrawer } from './CanvasDrawer';

export class DrawSelectionHelper {
  #selectedLineCount = 0;

  private characterCountToSelectLeft: number;
  private lastCharacterIndex = 0;

  public get selectedLineCount() {
    return this.#selectedLineCount;
  }

  constructor(
    private readonly selection: Selection,
    private readonly canvasContext: CanvasRenderingContext2D,
    private canvasDrawer: CanvasDrawer,
  ) {
    this.characterCountToSelectLeft = selection.end - selection.start;
  }

  public processLineAndMaybeDrawSelection(contentRect: ContentRect) {

    if (
      (this.selection.start >= this.lastCharacterIndex || this.selection.end >= this.lastCharacterIndex) &&
      this.characterCountToSelectLeft > 0
    ) {
      const { start, end } = this.selection;
      let charactersToSelect: string;
      let lineOffsetX = 0;

      if (this.selectedLineCount === 0) {
        charactersToSelect = line.slice(start, end);
        ({ width: lineOffsetX } = this.canvasContext.measureText(line.slice(0, start)));
      } else {
        charactersToSelect = line.slice(0, this.characterCountToSelectLeft);
      }

      this.characterCountToSelectLeft -= charactersToSelect.length;
      this.#selectedLineCount += 1;

      const { width } = this.canvasContext.measureText(charactersToSelect);

      this.drawSelection(contentRect, lineOffsetX, width, lineIndex);
    }

    this.lastCharacterIndex += line.length;
  }

  private drawSelection(contentRect: ContentRect, lineOffsetX: number, width: number, lineIndex: number) {
    this.canvasDrawer.rect({
      position: new Vector(
        contentRect.position.x + lineOffsetX,
        contentRect.position.y + contentRect.lineHeight * lineIndex,
      ),
      dimensions: new Dimensions(width, contentRect.lineHeight),
      fill: true,
      strokeStyle: 'transparent',
      fillStyle: 'rgba(0, 0, 255, 0.2)',
    });
  }
}
