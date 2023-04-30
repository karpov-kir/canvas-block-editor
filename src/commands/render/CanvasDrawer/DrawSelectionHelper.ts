import { ContentRect } from '../../../stores/BlockRectStore';
import { Dimensions } from '../../../utils/math/Dimensions';
import { Vector } from '../../../utils/math/Vector';
import { Selection } from '../../select/SelectCommand';
import { Drawer } from '../RenderService';

export class DrawSelectionHelper {
  #selectedLineCount = 0;

  private lastCharacterIndex = 0;
  private lastLineIndex = 0;

  public get selectedLineCount() {
    return this.#selectedLineCount;
  }

  constructor(
    private readonly selection: Selection,
    private readonly canvasContext: CanvasRenderingContext2D,
    private canvasDrawer: Drawer,
  ) {}

  public processLineAndMaybeDrawSelection(contentRect: ContentRect) {
    const line = contentRect.lines[this.lastLineIndex];
    const { start: absoluteSelectionStart, end: absoluteSelectionEnd } = this.selection;
    const absoluteLineStart = this.lastCharacterIndex;
    const absoluteLineEnd = absoluteLineStart + line.length;

    const selectionStartInLine = Math.max(absoluteSelectionStart - absoluteLineStart, 0);
    const absoluteSelectionEndInLine = Math.min(absoluteSelectionEnd, absoluteLineEnd);
    const selectionEndInLine = absoluteSelectionEndInLine - absoluteLineStart;
    const selectedCharacterCountInLine = selectionEndInLine - selectionStartInLine;

    if (selectedCharacterCountInLine > 0) {
      const charactersToSelectInLine = line.slice(selectionStartInLine, selectionEndInLine);
      const { width } = this.canvasContext.measureText(charactersToSelectInLine);
      let selectionOffsetX = 0;

      if (this.selectedLineCount === 0) {
        ({ width: selectionOffsetX } = this.canvasContext.measureText(line.slice(0, selectionStartInLine)));
      }

      this.#selectedLineCount += 1;

      this.drawSelection(contentRect, selectionOffsetX, width);
    }

    this.lastCharacterIndex += line.length;
    this.lastLineIndex++;
  }

  private drawSelection(contentRect: ContentRect, selectionOffsetX: number, width: number) {
    this.canvasDrawer.rect({
      position: new Vector(
        contentRect.position.x + selectionOffsetX,
        contentRect.position.y + contentRect.lineHeight * this.lastLineIndex,
      ),
      dimensions: new Dimensions(width, contentRect.lineHeight),
      fill: true,
      strokeStyle: 'transparent',
      fillStyle: 'rgba(0, 0, 255, 0.2)',
    });
  }
}
