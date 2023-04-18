import { BlockRect, BlockRectStore, ContentRect, Margin, Padding } from '../../stores/BlockRectStore';
import { Block, BlockStore, BlockType } from '../../stores/BlockStore';
import { DocumentStore } from '../../stores/DocumentStore';
import { Dimensions } from '../../utils/math/Dimensions';
import { Vector } from '../../utils/math/Vector';

export interface RenderTextOptions {
  position: Vector;
  width: number;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  text: string;
  padding: Padding;
  margin: Margin;
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
  text(options: RenderTextOptions): ContentRect;
  setViewportSize(dimensions: Dimensions): void;
  clear(): void;
}
export class RenderService {
  constructor(
    private readonly drawer: Drawer,
    private readonly blockStore: BlockStore,
    private readonly blockReactStore: BlockRectStore,
    private readonly documentStore: DocumentStore,
  ) {}

  private renderBlockRect(blockRect: BlockRect, strokeStyle: string) {
    this.drawer.rect({
      x: blockRect.position.x + blockRect.margin.horizontal,
      y: blockRect.position.y + blockRect.margin.vertical,
      width: blockRect.dimensions.width - blockRect.margin.horizontal * 2,
      height: blockRect.dimensions.height - blockRect.margin.vertical * 2,
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
    blockRectWidth: number,
    position: Vector,
    padding: Padding,
    margin: Margin,
  ): ContentRect {
    return this.drawer.text({
      width: blockRectWidth,
      position,
      text: block.type === BlockType.CreateBlock ? 'New +' : block.content,
      fontFamily: 'Arial',
      fontSize: 16,
      lineHeight: 20,
      padding,
      margin,
    });
  }

  public render() {
    this.drawer.clear();

    const { blocks } = this.blockStore;

    let nextBlockRectStartY = 0;
    blocks.forEach((block) => {
      const documentVsMaxContentWidthDiff = this.documentStore.dimensions.width - this.documentStore.maxContentWidth;
      const margin = new Margin(5, 5);
      const padding = new Padding(5, 5);
      const blockRectStartX = documentVsMaxContentWidthDiff > 0 ? documentVsMaxContentWidthDiff / 2 : 0;
      const blockRectPosition = new Vector(blockRectStartX, nextBlockRectStartY);
      const blockRectWidth =
        this.documentStore.dimensions.width > this.documentStore.maxContentWidth
          ? this.documentStore.maxContentWidth
          : this.documentStore.dimensions.width < this.documentStore.minContentWidth
          ? this.documentStore.minContentWidth
          : this.documentStore.dimensions.width;

      const contentRect = this.renderBlockContent(block, blockRectWidth, blockRectPosition, padding, margin);
      const contentBoxHeight = contentRect.dimensions.height + margin.horizontal * 2 + padding.horizontal * 2;
      const blockRect = new BlockRect(
        block.id,
        padding,
        margin,
        contentRect,
        blockRectPosition,
        new Dimensions(blockRectWidth, contentBoxHeight),
      );

      this.blockReactStore.attach(block.id, blockRect);
      this.maybeRenderInactiveBlockRect(block, blockRect);

      nextBlockRectStartY += contentBoxHeight + 1;
    });

    this.maybeRenderActiveBlockRect();
    this.maybeRenderHighlightedBlockRect();
  }
}
