import { createCanvas as nodeCreateCanvas } from 'canvas';

// class PatchedCanvasRenderingContext2D extends NodeCanvasRenderingContext2D {
//   public getContextAttributes(): ReturnType<CanvasRenderingContext2D['getContextAttributes']> {
//     throw new Error('Not implemented');
//   }

//   public isPointInStroke(): ReturnType<CanvasRenderingContext2D['isPointInPath']> {
//     throw new Error('Not implemented');
//   }

//   public createConicGradient(): ReturnType<CanvasRenderingContext2D['createConicGradient']> {
//     throw new Error('Not implemented');
//   }

//   public get filter() {
//     throw new Error('Not implemented');
//   }

//   public set filter(filter: string) {
//     throw new Error('Not implemented');
//   }

//   public get imageSmoothingQuality() {
//     throw new Error('Not implemented');
//   }

//   public set imageSmoothingQuality(imageSmoothingQuality: string) {
//     throw new Error('Not implemented');
//   }

//   public get direction() {
//     throw new Error('Not implemented');
//   }

//   public set direction(direction: string) {
//     throw new Error('Not implemented');
//   }

//   public get kerning() {
//     throw new Error('Not implemented');
//   }

//   public set kerning(kerning: string) {
//     throw new Error('Not implemented');
//   }

//   public get fontKerning() {
//     throw new Error('Not implemented');
//   }

//   public set fontKerning(kerning: string) {
//     throw new Error('Not implemented');
//   }

//   public get drawFocusIfNeeded() {
//     throw new Error('Not implemented');
//   }

//   public set drawFocusIfNeeded(drawFocusIfNeeded: string) {
//     throw new Error('Not implemented');
//   }
// }

export function createCanvas() {
  const canvasElement = nodeCreateCanvas(500, 500);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const canvasContext = canvasElement.getContext('2d') as CanvasRenderingContext2D;

  return { canvasContext, canvasElement };
}
