import { BlockRect, BlockRectStore, Padding } from '../../stores/BlockRectStore';
import { BlockStore, BlockType } from '../../stores/BlockStore';
import { Dimensions } from '../../utils/math/Dimensions';
import { Vector } from '../../utils/math/Vector';

export interface RenderTextOptions {
  x: number;
  y: number;
  width: number;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  text: string;
  padding: Padding;
}

export interface RenderRectOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  strokeStyle: string;
  fill?: boolean;
}

export interface Drawer {
  rect(options: RenderRectOptions): void;
  text(options: RenderTextOptions): number;
  setViewportSize(dimensions: Dimensions): void;
  clear(): void;
}

const defaultStyles = {
  fontFamily: 'Arial',
  fontSize: 16,
  lineHeight: 20,
  width: 100,
  padding: new Padding(5, 5),
};

export class RenderService {
  constructor(
    private readonly drawer: Drawer,
    private readonly blockStore: BlockStore,
    private readonly blockReactStore: BlockRectStore,
  ) {}

  render() {
    this.drawer.clear();

    const { highlightedBlock, activeBlock, blocks } = this.blockStore;
    const { blockRects } = this.blockReactStore;

    let nextY = 0;
    blocks.forEach((block) => {
      const blockHeight = this.drawer.text({
        ...defaultStyles,
        x: 0,
        y: nextY,
        text: block.type === BlockType.CreateBlock ? 'New +' : block.content,
      });
      const blockRect = new BlockRect(
        block.id,
        new Padding(5, 5),
        new Vector(0, nextY),
        new Dimensions(defaultStyles.width, blockHeight),
      );

      this.blockReactStore.attach(block.id, blockRect);

      if (block.id === highlightedBlock?.id) {
        debugger;
      }

      if (block.id !== highlightedBlock?.id && block.id !== activeBlock?.block.id) {
        this.drawer.rect({
          x: blockRect.position.x,
          y: blockRect.position.y,
          width: blockRect.dimensions.width,
          height: blockRect.dimensions.height,
          strokeStyle: 'gray',
        });
      }

      nextY += blockHeight + 1;
    });

    const highlightedBlockRect = highlightedBlock ? blockRects.get(highlightedBlock.id) : undefined;
    const activeBlockRect = activeBlock ? blockRects.get(activeBlock.block.id) : undefined;

    if (activeBlockRect) {
      this.drawer.rect({
        x: activeBlockRect.position.x,
        y: activeBlockRect.position.y,
        width: activeBlockRect.dimensions.width,
        height: activeBlockRect.dimensions.height,
        strokeStyle: 'green',
      });
    }

    if (highlightedBlockRect && highlightedBlockRect.blockId !== activeBlockRect?.blockId) {
      this.drawer.rect({
        x: highlightedBlockRect.position.x,
        y: highlightedBlockRect.position.y,
        width: highlightedBlockRect.dimensions.width,
        height: highlightedBlockRect.dimensions.height,
        strokeStyle: 'red',
      });
    }
  }
}
