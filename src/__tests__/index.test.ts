import { createCanvas } from 'canvas';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

describe('test', () => {
  it('test', () => {
    const canvasElement = createCanvas(200, 200);
    const canvasContext = canvasElement.getContext('2d');

    canvasContext.font = '30px Impact';
    canvasContext.rotate(0.1);
    canvasContext.fillText('Awesome!', 50, 100);

    const imgBuffer = canvasElement.toBuffer('image/png');

    expect(imgBuffer).toMatchImageSnapshot({
      failureThreshold: 0.05,
      failureThresholdType: 'percent',
    });
  });
});
