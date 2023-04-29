import { Canvas } from 'canvas';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

import { DEFAULT_FONT_STYLES, Margin, Padding } from '../../../stores/BlockRectStore';
import { createCanvas } from '../../../testUtils/createCanvas';
import { Dimensions } from '../../../utils/math/Dimensions';
import { Vector } from '../../../utils/math/Vector';
import { Drawer } from '../RenderService';
import { CanvasDrawer } from './CanvasDrawer';

expect.extend({ toMatchImageSnapshot });

let canvasContext: CanvasRenderingContext2D;
let canvasElement: Canvas;
let drawer: Drawer;

beforeEach(() => {
  ({ canvasContext, canvasElement } = createCanvas());
  drawer = new CanvasDrawer(canvasContext);
});

describe(CanvasDrawer.name, () => {
  it('fits a text into a max width', () => {
    drawer.textContentRect({
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

  it('updates the canvas size', () => {
    drawer.setViewportSize({ width: 10, height: 10 });

    const imgBuffer = canvasElement.toBuffer('image/png');

    expect(imgBuffer).toMatchImageSnapshot({
      failureThreshold: 0.05,
      failureThresholdType: 'percent',
    });
  });

  it('renders a rect', () => {
    drawer.rect({ position: new Vector(100, 100), dimensions: new Dimensions(150, 250), strokeStyle: 'red' });

    const imgBuffer = canvasElement.toBuffer('image/png');

    expect(imgBuffer).toMatchImageSnapshot({
      failureThreshold: 0.05,
      failureThresholdType: 'percent',
    });
  });

  it('renders a filled rect', () => {
    drawer.rect({
      position: new Vector(100, 100),
      dimensions: new Dimensions(150, 250),
      strokeStyle: 'red',
      fill: true,
    });

    const imgBuffer = canvasElement.toBuffer('image/png');

    expect(imgBuffer).toMatchImageSnapshot({
      failureThreshold: 0.05,
      failureThresholdType: 'percent',
    });
  });

  it('rect stroke does not affect the following up text color', () => {
    drawer.rect({ position: new Vector(100, 100), dimensions: new Dimensions(10, 10), strokeStyle: 'red' });
    drawer.text({
      ...DEFAULT_FONT_STYLES,
      position: new Vector(100, 110),
      text: 'Test',
    });

    const imgBuffer = canvasElement.toBuffer('image/png');

    expect(imgBuffer).toMatchImageSnapshot({
      failureThreshold: 0.05,
      failureThresholdType: 'percent',
    });
  });
});
