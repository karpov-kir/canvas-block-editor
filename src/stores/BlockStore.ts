import { createIdGenerator } from '../utils/idGenerator';

export interface Block {
  id: number;
  content: string;
  type: string;
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

  public add(type: string) {
    const id = this.idGenerator();
    this.blocks.set(id, {
      type,
      content: '',
      id,
    });
  }
}