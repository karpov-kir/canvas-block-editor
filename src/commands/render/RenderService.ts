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
import { Selection } from '../selectInBlock/SelectInBlockCommand';

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
}

export interface RenderSelectionOptions {
  lines: string[];
  lineHeight: number;
  selection: Selection;
  contentStartPosition: Vector;
}

export interface RenderCarriageOptions {
  lines: string[];
  lineHeight: number;
  carriagePosition: number;
  contentStartPosition: Vector;
}

export interface RenderCarriageResult {
  stopBlinking: () => void;
  update: (newOptions: RenderCarriageOptions) => void;
}

export interface RenderRectOptions {
  position: Vector;
  dimensions: Dimensions;
  strokeStyle: string;
  fill?: boolean;
  fillStyle?: string;
}

export interface ClearRectOptions {
  position: Vector;
  dimensions: Dimensions;
}

export interface Drawer {
  rect(options: RenderRectOptions): void;
  clearRect(options: ClearRectOptions): void;
  text(options: RenderTextOptions): void;
  selection(options: RenderSelectionOptions): void;
  carriage(options: RenderCarriageOptions): RenderCarriageResult;
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

  private blinkingCarriages = new Map<number, RenderCarriageResult>();

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

  private maybeRenderNormalBlock(block: Block, blockRect: BlockRect) {
    const { focusedBlocks, highlightedBlocks } = this.blockStore;

    const isBlockFocused = focusedBlocks.has(block.id);
    const isBlockHighlighted = highlightedBlocks.has(block.id);
    const isBlockNormal = !isBlockFocused && !isBlockHighlighted;

    if (isBlockNormal) {
      this.renderBlockRect(blockRect, 'gray');
    }
  }

  private renderFocusedBlocks() {
    const { focusedBlocks } = this.blockStore;

    focusedBlocks.forEach((block) => {
      const focusedBlockRect = this.blockRectStore.getById(block.id);

      this.renderBlockRect(focusedBlockRect, 'green');
    });
  }

  private renderHighlightedBlocks() {
    const { highlightedBlocks, focusedBlocks } = this.blockStore;

    highlightedBlocks.forEach((highlightedBlock) => {
      const isHighlightedBlockFocused = focusedBlocks.has(highlightedBlock.id);

      if (isHighlightedBlockFocused) {
        return;
      }

      const highlightedBlockRect = this.blockRectStore.getById(highlightedBlock.id);

      this.renderBlockRect(highlightedBlockRect, 'red');
    });
  }

  private renderBlockContent(
    block: Block,
    blockRectWidth: number,
    position: Vector,
    padding: Padding,
    margin: Margin,
  ): ContentRect {
    const contentRect = this.drawer.textContentRect({
      ...DEFAULT_FONT_STYLES,
      width: blockRectWidth,
      position,
      text: block.type === BlockType.CreateBlock ? 'New +' : block.content,
      padding,
      margin,
    });

    return contentRect;
  }

  private maybeRenderSelection(block: Block, contentRect: ContentRect) {
    if (!block.selection) {
      return;
    }

    this.drawer.selection({
      lines: contentRect.lines,
      selection: block.selection,
      lineHeight: contentRect.lineHeight,
      contentStartPosition: contentRect.position,
    });
  }

  private maybeRenderCarriage(block: Block, contentRect: ContentRect) {
    if (!block.carriagePosition) {
      return;
    }

    const existingBlinkingCarriage = this.blinkingCarriages.get(block.id);
    const renderCarriageOptions = {
      lines: contentRect.lines,
      carriagePosition: block.carriagePosition,
      lineHeight: contentRect.lineHeight,
      contentStartPosition: contentRect.position,
    };

    if (existingBlinkingCarriage) {
      existingBlinkingCarriage.update(renderCarriageOptions);
      return;
    }

    const newBlinkingCarriage = this.drawer.carriage(renderCarriageOptions);
    this.blinkingCarriages.set(block.id, newBlinkingCarriage);
  }

  private removeOldBlinkingCarriages() {
    this.blinkingCarriages.forEach((blinkingCarriage, blockId) => {
      if (this.blockStore.blocks.has(blockId)) {
        return;
      }

      blinkingCarriage.stopBlinking();
      this.blinkingCarriages.delete(blockId);
    });
  }

  public render() {
    this.drawer.clear();
    this.removeOldBlinkingCarriages();

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
      const contentRect = this.renderBlockContent(block, blockRectWidth, blockRectPosition, padding, margin);
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

      this.maybeRenderNormalBlock(block, blockRect);
      this.maybeRenderSelection(block, contentRect);
      this.maybeRenderCarriage(block, contentRect);

      nextBlockRectStartY += blockRectHeight + 1;
    });

    this.renderHighlightedBlocks();
    this.renderFocusedBlocks();
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
