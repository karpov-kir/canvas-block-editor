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
}

export interface ActiveBlock {
  block: Block;
  carriagePosition: number;
}

export class BlockStore {
  public readonly blocks: Map<number, Block> = new Map();

  private idGenerator = createIdGenerator();

  public activeBlock?: ActiveBlock;

  public highlightedBlock?: Block;

  public add(type: BlockType) {
    const id = this.idGenerator();
    this.blocks.set(id, {
      type,
      content: '',
      id,
    });
  }
}
