import { BlockRect, BlockRectStore, Margin, Padding } from '../../stores/BlockRectStore';
import { Block, BlockStore, BlockType } from '../../stores/BlockStore';
import { DocumentStore } from '../../stores/DocumentStore';
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
    private readonly documentStore: DocumentStore,
  ) {}

  private renderBlockRect(blockRect: BlockRect, strokeStyle: string) {
    this.drawer.rect({
      x: blockRect.position.x,
      y: blockRect.position.y,
      width: blockRect.dimensions.width,
      height: blockRect.dimensions.height,
      strokeStyle,
    });
  }

  private maybeRenderInactiveBlockRect(block: Block, blockRect: BlockRect) {
    const { highlightedBlock, activeBlock } = this.blockStore;

    const isBlockFocused = activeBlock?.block.id === block.id;
    const isBlockHighlighted = highlightedBlock?.id === block.id;
    const isBlockInactive = !isBlockFocused && !isBlockHighlighted;

    if (isBlockInactive) {
      this.renderBlockRect(blockRect, 'gray');
    }
  }

  private maybeRenderActiveBlockRect() {
    const { blockRects } = this.blockReactStore;
    const { activeBlock } = this.blockStore;
    const activeBlockRect = activeBlock ? blockRects.get(activeBlock.block.id) : undefined;

    if (activeBlockRect) {
      this.renderBlockRect(activeBlockRect, 'green');
    }
  }

  private maybeRenderHighlightedBlockRect() {
    const { highlightedBlock, activeBlock } = this.blockStore;
    const { blockRects } = this.blockReactStore;

    const highlightedBlockRect = highlightedBlock ? blockRects.get(highlightedBlock.id) : undefined;
    const activeBlockRect = activeBlock ? blockRects.get(activeBlock.block.id) : undefined;
    const isHighlightedBlockFocused = highlightedBlockRect?.blockId === activeBlockRect?.blockId;

    if (highlightedBlockRect && !isHighlightedBlockFocused) {
      this.renderBlockRect(highlightedBlockRect, 'red');
    }
  }

  private renderBlockContent(
    block: Block,
    contentWidth: number,
    contentStartX: number,
    blockContentStartY: number,
    padding: Padding,
    margin: Margin,
  ) {
    const blockHeight = this.drawer.text({
      width: contentWidth,
      x: contentStartX,
      y: blockContentStartY,
      text: block.type === BlockType.CreateBlock ? 'New +' : block.content,
      fontFamily: 'Arial',
      fontSize: 16,
      lineHeight: 20,
      padding,
      margin,
    });

    return blockHeight;
  }

  public render() {
    this.drawer.clear();

    const { blocks } = this.blockStore;

    let nextBlockContentStartY = 0;
    blocks.forEach((block) => {
      const documentVsMaxContentWithDiff = this.documentStore.dimensions.width - this.documentStore.maxContentWidth;
      const margin = new Margin(5, 5);
      const padding = new Padding(5, 5);

      const blockHeight = this.renderBlockContent(
        block,
        contentWidth,
        contentStartX,
        nextBlockContentStartY,
        padding,
        margin,
      );
      const blockRect = new BlockRect(
        block.id,
        padding,
        margin,
        new Vector(contentStartX, nextBlockContentStartY),
        new Dimensions(contentWidth, blockHeight),
      );

      this.blockReactStore.attach(block.id, blockRect);
      this.maybeRenderInactiveBlockRect(block, blockRect);

      nextBlockContentStartY += blockHeight + 1;
    });

    this.maybeRenderActiveBlockRect();
    this.maybeRenderHighlightedBlockRect();
  }
}
