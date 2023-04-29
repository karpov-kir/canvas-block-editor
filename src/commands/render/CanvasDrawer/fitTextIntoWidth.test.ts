import { DEFAULT_FONT_STYLES, Margin, Padding } from '../../../stores/BlockRectStore';
import { createCanvas } from '../../../testUtils/createCanvas';
import { fitTextIntoWidth } from './fitTextIntoWidth';

let canvasContext: CanvasRenderingContext2D;

beforeEach(() => {
  ({ canvasContext } = createCanvas());
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
