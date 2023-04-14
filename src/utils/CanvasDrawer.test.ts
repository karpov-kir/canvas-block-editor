import { toMatchImageSnapshot } from 'jest-image-snapshot';

import { Padding } from '../stores/BlockRectStore';
import { createCanvas } from '../testUtils/createCanvas';
import { CanvasDrawer } from './CanvasDrawer';

expect.extend({ toMatchImageSnapshot });

describe(CanvasDrawer, () => {
  it('fits text into a max width', () => {
    const { canvasContext, canvasElement } = createCanvas();
    const drawer = new CanvasDrawer(canvasContext);

    drawer.renderText({
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
});
