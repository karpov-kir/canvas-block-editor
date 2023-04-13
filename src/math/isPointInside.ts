import { Rectangle } from './Rectangle';
import { Vector } from './Vector';

export function isPointInside(point: Vector, rectangle: Rectangle): boolean {
  if (point.x < rectangle.position.x || point.x > rectangle.position.x + rectangle.dimensions.width) {
    return false;
  }

  if (point.y < rectangle.position.y || point.y > rectangle.position.y + rectangle.dimensions.height) {
    return false;
  }

  return true;
}
