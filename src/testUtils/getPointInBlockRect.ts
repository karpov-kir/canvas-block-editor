import { BlockRect } from '../stores/BlockRectStore';
import { Vector } from '../utils/math/Vector';

export function getPointInBlockRect(blockRect: BlockRect) {
  const { position, margin } = blockRect;

  return new Vector(position.x + margin.horizontal, position.y + margin.vertical);
}
