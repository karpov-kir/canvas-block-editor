import { createIdGenerator } from './idGenerator';

interface Block {
  id: number;
  content: string;
  type: string;
}

export class BlockStore {
  #blocks: Block[] = [];

  private idGenerator = createIdGenerator();

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
