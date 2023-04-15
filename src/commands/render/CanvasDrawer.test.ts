import { Canvas } from 'canvas';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

import { Padding } from '../../stores/BlockRectStore';
import { createCanvas } from '../../testUtils/createCanvas';
import { CanvasDrawer, fitTextIntoWidth } from './CanvasDrawer';
import { Drawer } from './RenderService';

expect.extend({ toMatchImageSnapshot });

let canvasContext: CanvasRenderingContext2D;
let canvasElement: Canvas;
let drawer: Drawer;

beforeEach(() => {
  ({ canvasContext, canvasElement } = createCanvas());
  drawer = new CanvasDrawer(canvasContext);
});

describe(CanvasDrawer, () => {
  it('fits text into a max width', () => {
    drawer.text({
      x: 100,
      y: 100,
      width: 100,
      fontFamily: 'Arial',
      fontSize: 16,
      lineHeight: 20,
      text: 'A'.repeat(15),
      padding: new Padding(5, 5),
    });

    const imgBuffer = canvasElement.toBuffer('image/png');

    expect(imgBuffer).toMatchImageSnapshot({
      failureThreshold: 0.05,
      failureThresholdType: 'percent',
    });
  });

  it('updates canvas size', () => {
    drawer.setViewportSize({ width: 10, height: 10 });

    const imgBuffer = canvasElement.toBuffer('image/png');

    expect(imgBuffer).toMatchImageSnapshot({
      failureThreshold: 0.05,
      failureThresholdType: 'percent',
    });
  });

  it('renders rect', () => {
    drawer.rect({ x: 100, y: 100, width: 150, height: 250, strokeStyle: 'red' });

    const imgBuffer = canvasElement.toBuffer('image/png');

    expect(imgBuffer).toMatchImageSnapshot({
      failureThreshold: 0.05,
      failureThresholdType: 'percent',
    });
  });

  it('renders a filled rect', () => {
    drawer.rect({ x: 100, y: 100, width: 150, height: 250, strokeStyle: 'red', fill: true });

    const imgBuffer = canvasElement.toBuffer('image/png');

    expect(imgBuffer).toMatchImageSnapshot({
      failureThreshold: 0.05,
      failureThresholdType: 'percent',
    });
  });

  it('rect stroke does not affect the following up text', () => {
    drawer.rect({ x: 100, y: 100, width: 10, height: 10, strokeStyle: 'red' });
    drawer.text({
      x: 100,
      y: 110,
      width: 100,
      fontFamily: 'Arial',
      fontSize: 16,
      lineHeight: 20,
      text: 'Test',
      padding: new Padding(5, 5),
    });

    const imgBuffer = canvasElement.toBuffer('image/png');

    expect(imgBuffer).toMatchImageSnapshot({
      failureThreshold: 0.05,
      failureThresholdType: 'percent',
    });
  });

  describe(fitTextIntoWidth, () => {
    it('fits text into width', () => {
      const result = fitTextIntoWidth(canvasContext, {
        text: 'A'.repeat(15),
        width: 100,
        fontFamily: 'Arial',
        lineHeight: 20,
        fontSize: 15,
        padding: new Padding(5, 5),
      });

      expect(result).toEqual({
        lines: ['A'.repeat(8), 'A'.repeat(7)],
        box: {
          height: 40,
          heightWithPaddings: 50,
          lastLineTopOffset: 25,
          lastLineWidth: 70.0341796875,
          lineHeightOffset: 2.5,
          width: 0,
          widthWithPaddings: 10,
        },
        lineMetrics: [
          {
            topOffset: 5,
            width: 80.0390625,
          },
          {
            topOffset: 25,
            width: 70.0341796875,
          },
        ],
      });
    });
  });
});
