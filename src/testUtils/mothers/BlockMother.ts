import { Block } from '../../BlockStore';
import { createIdGenerator } from '../../idGenerator';
import { Builder } from './Builder';
import { ObjectMother } from './ObjectMother';

class BlockBuilder extends Builder<Block> {
  private idGenerator = createIdGenerator();

  public instance = this.createEmpty();

  public createEmpty() {
    return {
      id: this.idGenerator(),
      content: '',
      type: 'text',
    };
  }

  public setContent(content: string) {
    this.instance.content = content;
    return this;
  }
}

// TODO complex scenarios
// class BlockDirector {
//   construct
// }

export class BlockMother extends ObjectMother<BlockBuilder> {
  public readonly builder = new BlockBuilder();

  public withContent() {
    this.builder.setContent('Hello world!');
    return this;
  }

  public withLongContent() {
    this.builder.setContent(
      "Hello world! But I'm not just a hello world, I'm also a long content that is repeated!"
        .repeat(2)
        .split('!')
        .join('! '),
    );

    return this;
  }
}
