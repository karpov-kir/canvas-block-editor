import { Canvas } from 'canvas';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

import { DEFAULT_FONT_STYLES, Margin, Padding } from '../../stores/BlockRectStore';
import { createCanvas } from '../../testUtils/createCanvas';
import { Vector } from '../../utils/math/Vector';
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
      ...DEFAULT_FONT_STYLES,
      position: new Vector(100, 100),
      width: 100,
      text: 'A'.repeat(15),
      padding: new Padding(5, 5),
      margin: new Margin(5, 5),
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
      ...DEFAULT_FONT_STYLES,
      position: new Vector(100, 110),
      width: 100,
      text: 'Test',
      padding: new Padding(5, 5),
      margin: new Margin(5, 5),
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
        ...DEFAULT_FONT_STYLES,
        text: '12!-45asdfZXCVB@',
        width: 100,
        padding: new Padding(5, 5),
        margin: new Margin(5, 5),
      });

      expect(result).toEqual({
        lines: ['12!-45asdf', 'ZXCVB@'],
        dimensions: {
          width: expect.any(Number),
          height: 40,
        },
        lineHeightOffset: 4,
        lineMetrics: [
          {
            topOffset: 0,
            width: expect.any(Number),
          },
          {
            topOffset: 20,
            width: expect.any(Number),
          },
        ],
      });
      expect(Math.round(result.dimensions.width)).toBe(76);
      expect(Math.round(result.lineMetrics[0].width)).toBe(76);
      expect(Math.round(result.lineMetrics[1].width)).toBe(70);
    });
  });
});
