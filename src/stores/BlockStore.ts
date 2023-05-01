import { Selection } from '../commands/select/SelectCommand';
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
  selection?: Selection;
  carriagePosition: number;
}

export class BlockStore {
  public readonly blocks: Map<number, Block> = new Map();
  public readonly focusedBlocks: Map<number, Block> = new Map();

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

  private idGenerator = createIdGenerator();

  public highlightedBlock?: Block;

  public add(type: BlockType) {
    const id = this.idGenerator();
    const block = {
      type,
      content: '',
      id,
      isFocused: false,
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
}
