import { Canvas } from 'canvas';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

import { Padding } from '../../stores/BlockRectStore';
import { createCanvas } from '../../testUtils/createCanvas';
import { CanvasDrawer } from './CanvasDrawer';
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

  it('renders a rect', () => {
    drawer.rect({ x: 100, y: 100, width: 150, height: 250 });

    const imgBuffer = canvasElement.toBuffer('image/png');

    expect(imgBuffer).toMatchImageSnapshot({
      failureThreshold: 0.05,
      failureThresholdType: 'percent',
    });
  });
});
