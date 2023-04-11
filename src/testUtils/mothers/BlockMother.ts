import { ActiveBlock, Block } from '../../BlockStore';
import { createIdGenerator } from '../../idGenerator';

class BlockBuilder {
  #block: Block;

  private idGenerator = createIdGenerator();

  constructor() {
    this.#block = this.createEmpty();
  }

  private createEmpty() {
    return {
      id: this.idGenerator(),
      content: '',
      type: 'text',
      position: {
        x: 0,
        y: 0,
      },
    };
  }

  public setContent(content: string) {
    this.#block.content = content;

    return this;
  }

  public getAndReset() {
    const block = this.#block;

    this.#block = this.createEmpty();

    return block;
  }
}

// TODO complex scenarios
// class BlockDirector {
//   construct
// }

class ObjectMother<T> {
  protected history: T[] = [];

  protected addToHistory(object: T) {
    this.history.push(object);
  }

  public getLast() {
    return this.history[this.history.length - 1];
  }
}

export class BlockMother extends ObjectMother<Block> {
  public readonly builder = new BlockBuilder();

  public createEmpty() {
    this.addToHistory(this.builder.getAndReset());
    return this.getLast();
  }

  public createWithContent() {
    this.addToHistory(this.builder.setContent('Hello world!').getAndReset());
    return this.getLast();
  }

  public createWithLongContent() {
    this.addToHistory(
      this.builder
        .setContent(
          "Hello world! But I'm not just a hello world, I'm also a long content that is repeated!"
            .repeat(2)
            .split('!')
            .join('! '),
        )
        .getAndReset(),
    );
    return this.getLast();
  }
}

export class ActiveBlockMother extends ObjectMother<ActiveBlock> {
  public readonly blockMother = new BlockMother();

  public createEmpty() {
    this.addToHistory({
      block: this.blockMother.createEmpty(),
      carriagePosition: 0,
    });

    return this.getLast();
  }
}
