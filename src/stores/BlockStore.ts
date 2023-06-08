import { Selection } from '../commands/selectInBlock/SelectInBlockCommand';
import { createIdGenerator } from '../utils/idGenerator';

export enum BlockType {
  Text = 'text',
  H1 = 'h1',
  H2 = 'h2',
  CreateBlock = 'createBlock',
}

export interface Block {
  id: number;
  content: string;
  type: BlockType;
  isFocused: boolean;
  isHighlighted: boolean;
  selection?: Selection;
  carriagePosition: number;
}

export class BlockStore {
  public readonly blocks: Map<number, Block> = new Map();
  public readonly focusedBlocks: Map<number, Block> = new Map();
  public readonly highlightedBlocks: Map<number, Block> = new Map();
  public readonly blocksWithSelection: Map<number, Block> = new Map();

  private readonly idGenerator = createIdGenerator();

  public add(type: BlockType) {
    const id = this.idGenerator();
    const block = {
      type,
      content: '',
      id,
      isFocused: false,
      isHighlighted: false,
      carriagePosition: 0,
    };

    this.blocks.set(id, block);

    return block;
  }

  public getById(blockId: number) {
    const block = this.blocks.get(blockId);

    if (!block) {
      throw new Error(`Block with ID ${blockId} not found`);
    }

    return block;
  }

  public getFocusedBlockById(blockId: number) {
    const block = this.focusedBlocks.get(blockId);

    if (!block) {
      throw new Error(`Block with ID ${blockId} not found`);
    }

    return block;
  }

  public getHighlightedBlock(blockId: number) {
    const block = this.highlightedBlocks.get(blockId);

    if (!block) {
      throw new Error(`Block with ID ${blockId} not found`);
    }

    return block;
  }

  public focusBlock(blockId: number) {
    const block = this.getById(blockId);

    block.isFocused = true;
    this.focusedBlocks.set(blockId, block);
  }

  public removeFocusFromBlock(blockId: number) {
    const block = this.getById(blockId);

    block.isFocused = false;
    this.focusedBlocks.delete(blockId);
  }

  public highlightBlock(blockId: number) {
    const block = this.getById(blockId);

    block.isHighlighted = true;
    this.highlightedBlocks.set(blockId, block);
  }

  public removeHighlightFromBlock(blockId: number) {
    const block = this.getById(blockId);

    block.isHighlighted = false;
    this.highlightedBlocks.delete(blockId);
  }

  public setSelection(blockId: number, selection: Selection) {
    const block = this.getById(blockId);

    if (selection.end > block.content.length) {
      throw new RangeError('Selection is out of range');
    }

    this.blocksWithSelection.set(blockId, block);
    block.selection = selection;
  }

  public removeSelection(blockId: number) {
    const block = this.getById(blockId);

    block.selection = undefined;
  }
}
