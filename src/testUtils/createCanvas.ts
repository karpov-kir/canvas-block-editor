import { createCanvas as nodeCreateCanvas } from 'canvas';

export function createCanvas() {
  const canvasElement = nodeCreateCanvas(500, 500);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const canvasContext = canvasElement.getContext('2d') as CanvasRenderingContext2D;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore not exists in node-canvas, emulating it
  canvasContext.canvas.style = {
    width: '500px',
    height: '500px',
  };

  return { canvasContext, canvasElement };
}
