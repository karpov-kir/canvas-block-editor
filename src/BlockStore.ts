import { createIdGenerator } from './idGenerator';

interface Block {
  id: number;
  content: string;
  type: string;
}

interface ActiveBlock {
  block: Block;
  carriagePosition: number;
}

export class BlockStore {
  #blocks: Block[] = [];

  private idGenerator = createIdGenerator();

  public activeBlock?: ActiveBlock;

  public get blocks() {
    return this.#blocks;
  }

  public add(type: string) {
    this.#blocks.push({
      type,
      content: '',
      id: this.idGenerator(),
    });
  }
}
