import { createCanvas as nodeCreateCanvas } from 'canvas';

export function createCanvas() {
  const canvasElement = nodeCreateCanvas(500, 500);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const canvasContext = canvasElement.getContext('2d') as CanvasRenderingContext2D;

  return { canvasContext, canvasElement };
}
