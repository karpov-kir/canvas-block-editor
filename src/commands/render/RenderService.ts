import {
  BlockRect,
  BlockRectStore,
  ContentRect,
  DEFAULT_FONT_STYLES,
  Margin,
  Padding,
} from '../../stores/BlockRectStore';
import { Block, BlockStore, BlockType } from '../../stores/BlockStore';
import { DocumentStore } from '../../stores/DocumentStore';
import { constrain } from '../../utils/math/constrain';
import { Dimensions } from '../../utils/math/Dimensions';
import { Vector } from '../../utils/math/Vector';
import { Selection } from '../select/SelectCommand';

export interface RenderTextOptions {
  position: Vector;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  text: string;
}

export interface RenderTextContentRectOptions extends RenderTextOptions {
  width: number;
  padding: Padding;
  margin: Margin;
  selection?: Selection;
}

export interface RenderRectOptions {
  position: Vector;
  dimensions: Dimensions;
  strokeStyle: string;
  fill?: boolean;
  fillStyle?: string;
}

export interface Drawer {
  rect(options: RenderRectOptions): void;
  text(options: RenderTextOptions): void;
  textContentRect(options: RenderTextContentRectOptions): ContentRect;
  setViewportSize(dimensions: Dimensions): void;
  clear(): void;
}
export class RenderService {
  constructor(
    private readonly drawer: Drawer,
    private readonly blockStore: BlockStore,
    private readonly blockRectStore: BlockRectStore,
    private readonly documentStore: DocumentStore,
  ) {}

  private renderBlockRect(blockRect: BlockRect, strokeStyle: string) {
    this.drawer.rect({
      position: new Vector(
        blockRect.position.x + blockRect.margin.horizontal,
        blockRect.position.y + blockRect.margin.vertical,
      ),
      dimensions: new Dimensions(
        blockRect.dimensions.width - blockRect.margin.horizontal * 2,
        blockRect.dimensions.height - blockRect.margin.vertical * 2,
      ),
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
    const { blockRects } = this.blockRectStore;
    const { activeBlock } = this.blockStore;
    const activeBlockRect = activeBlock ? blockRects.get(activeBlock.block.id) : undefined;

    if (activeBlockRect) {
      this.renderBlockRect(activeBlockRect, 'green');
    }
  }

  private maybeRenderHighlightedBlockRect() {
    const { highlightedBlock, activeBlock } = this.blockStore;
    const { blockRects } = this.blockRectStore;

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
    selection?: Selection,
  ): ContentRect {
    return this.drawer.textContentRect({
      ...DEFAULT_FONT_STYLES,
      width: blockRectWidth,
      position,
      text: block.type === BlockType.CreateBlock ? 'New +' : block.content,
      padding,
      margin,
      selection,
    });
  }

  public render() {
    this.drawer.clear();

    const { blocks } = this.blockStore;
    const {
      width: blockRectWidth,
      margin,
      padding,
      startX: blockRectStartX,
    } = getBaseBlockRectSizing(this.documentStore);

    let nextBlockRectStartY = 0;
    blocks.forEach((block) => {
      const blockRectPosition = new Vector(blockRectStartX, nextBlockRectStartY);
      const selection = getBlockSelection(this.blockStore, block);
      const contentRect = this.renderBlockContent(block, blockRectWidth, blockRectPosition, padding, margin, selection);
      const blockRectHeight = contentRect.dimensions.height + margin.horizontal * 2 + padding.horizontal * 2;
      const blockRect = new BlockRect(
        block.id,
        padding,
        margin,
        contentRect,
        blockRectPosition,
        new Dimensions(blockRectWidth, blockRectHeight),
      );

      this.blockRectStore.attach(block.id, blockRect);
      this.maybeRenderInactiveBlockRect(block, blockRect);

      nextBlockRectStartY += blockRectHeight + 1;
    });

    this.maybeRenderActiveBlockRect();
    this.maybeRenderHighlightedBlockRect();
  }
}

function getBaseBlockRectSizing(documentStore: DocumentStore) {
  const margin = new Margin(5, 5);
  const padding = new Padding(5, 5);
  const width = constrain(documentStore.dimensions.width, documentStore.minContentWidth, documentStore.maxContentWidth);
  const documentVsMaxContentWidthDiff = documentStore.dimensions.width - documentStore.maxContentWidth;
  const startX = documentVsMaxContentWidthDiff > 0 ? documentVsMaxContentWidthDiff / 2 : 0;

  return {
    margin,
    padding,
    width,
    startX,
  };
}

function getBlockSelection(blockStore: BlockStore, block: Block) {
  const { activeBlock } = blockStore;

  return activeBlock?.block.id === block.id ? activeBlock.selection : undefined;
}
