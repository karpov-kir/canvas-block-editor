interface Block {
  content: string;
  type: string;
}

export class BlockStore {
  #blocks: Block[] = [];

  public get blocks() {
    return this.#blocks;
  }

  public add(type: string) {
    this.#blocks.push({
      type,
      content: '',
    });
  }
}
