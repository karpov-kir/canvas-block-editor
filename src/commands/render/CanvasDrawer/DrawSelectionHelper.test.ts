import { createCanvas } from '../../../testUtils/createCanvas';
import { BlockRectMother } from '../../../testUtils/mothers/BlockRectMother';
import { StubDrawer } from '../../../testUtils/StubDrawer';
import { Dimensions } from '../../../utils/math/Dimensions';
import { Vector } from '../../../utils/math/Vector';
import { Selection } from '../../select/SelectCommand';
import { DrawSelectionHelper } from './DrawSelectionHelper';

const { canvasContext } = createCanvas();

const fontSize = 14;
const monospaceFont = 'Courier';
const characterWidth = 8.4013671875;
const canvasFont = `${fontSize}px ${monospaceFont}`;
const blockRectMother = new BlockRectMother();
const blockRect = blockRectMother.withLongContent().create();
const contentRect = blockRect.contentRect;
const firstLine = contentRect.lines[0];
const secondLine = contentRect.lines[1];
const firstLineStart = 0;
const firstLineEnd = firstLine.length;
const secondLineStart = firstLineEnd;
const secondLineEnd = secondLineStart + secondLine.length;

canvasContext.font = canvasFont;
contentRect.fontSize = 14;
contentRect.fontFamily = monospaceFont;

describe(DrawSelectionHelper.name, () => {
  it('draws a selection for the fist five characters', () => {
    const drawer = new StubDrawer();
    const drawSelectionHelper = new DrawSelectionHelper(
      new Selection(firstLineStart, firstLineStart + 5),
      canvasContext,
      drawer,
    );

    drawSelectionHelper.processLineAndMaybeDrawSelection(contentRect);

    expect(drawer.rect).toBeCalledTimes(1);
    expect(drawer.rect).toBeCalledWith(
      expect.objectContaining({
        dimensions: new Dimensions(characterWidth * 5, 20),
        position: contentRect.position,
      }),
    );
  });

  it('draws a selection for the last five characters of the first line', () => {
    const drawer = new StubDrawer();
    const drawSelectionHelper = new DrawSelectionHelper(
      new Selection(firstLineEnd - 5, firstLineEnd),
      canvasContext,
      drawer,
    );

    drawSelectionHelper.processLineAndMaybeDrawSelection(contentRect);

    expect(drawer.rect).toBeCalledTimes(1);
    expect(drawer.rect).toBeCalledWith(
      expect.objectContaining({
        dimensions: new Dimensions(characterWidth * 5, 20),
        position: new Vector(contentRect.position.x + characterWidth * (firstLine.length - 5), contentRect.position.y),
      }),
    );
  });

  it('draws a selection for the fist five characters of the second line', () => {
    const drawer = new StubDrawer();
    const drawSelectionHelper = new DrawSelectionHelper(
      new Selection(secondLineStart, secondLineStart + 5),
      canvasContext,
      drawer,
    );

    drawSelectionHelper.processLineAndMaybeDrawSelection(contentRect);
    drawSelectionHelper.processLineAndMaybeDrawSelection(contentRect);

    expect(drawer.rect).toBeCalledTimes(1);
    expect(drawer.rect).toBeCalledWith(
      expect.objectContaining({
        dimensions: new Dimensions(characterWidth * 5, 20),
        position: new Vector(contentRect.position.x, contentRect.position.y + contentRect.lineHeight),
      }),
    );
  });

  it('draws a selection for the last five characters of the second line', () => {
    const drawer = new StubDrawer();
    const drawSelectionHelper = new DrawSelectionHelper(
      new Selection(secondLineEnd - 5, secondLineEnd),
      canvasContext,
      drawer,
    );

    drawSelectionHelper.processLineAndMaybeDrawSelection(contentRect);
    drawSelectionHelper.processLineAndMaybeDrawSelection(contentRect);

    expect(drawer.rect).toBeCalledTimes(1);
    expect(drawer.rect).toBeCalledWith(
      expect.objectContaining({
        dimensions: new Dimensions(characterWidth * 5, 20),
        position: new Vector(
          contentRect.position.x + characterWidth * (secondLine.length - 5),
          contentRect.position.y + contentRect.lineHeight,
        ),
      }),
    );
  });

  it('draws a selection for the last five characters of the first string and for the five first characters of the second string', () => {
    const drawer = new StubDrawer();
    const drawSelectionHelper = new DrawSelectionHelper(
      new Selection(firstLineEnd - 5, secondLineStart + 5),
      canvasContext,
      drawer,
    );

    drawSelectionHelper.processLineAndMaybeDrawSelection(contentRect);
    drawSelectionHelper.processLineAndMaybeDrawSelection(contentRect);

    expect(drawer.rect).toBeCalledTimes(2);
    expect(drawer.rect).toBeCalledWith(
      expect.objectContaining({
        dimensions: new Dimensions(characterWidth * 5, 20),
        position: new Vector(contentRect.position.x + characterWidth * (firstLine.length - 5), contentRect.position.y),
      }),
    );
    expect(drawer.rect).toBeCalledWith(
      expect.objectContaining({
        dimensions: new Dimensions(characterWidth * 5, 20),
        position: new Vector(contentRect.position.x, contentRect.position.y + contentRect.lineHeight),
      }),
    );
  });
});
