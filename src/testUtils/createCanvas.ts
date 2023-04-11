import { createCanvas as nodeCreateCanvas } from 'canvas';

export function createCanvas() {
  const canvasElement = nodeCreateCanvas(500, 500);
  const canvasContext = canvasElement.getContext('2d') as CanvasRenderingContext2D;

  return { canvasContext, canvasElement };
}
