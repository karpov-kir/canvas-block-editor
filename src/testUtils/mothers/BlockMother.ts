import { Block, BlockType } from '../../stores/BlockStore';
import { createIdGenerator } from '../../utils/idGenerator';
import { Builder } from './Builder';
import { ObjectMother } from './ObjectMother';

class BlockBuilder extends Builder<Block> {
  private idGenerator = createIdGenerator();

  public instance = this.createEmpty();

  public createEmpty() {
    return {
      id: this.idGenerator(),
      content: '',
      type: BlockType.Text,
    };
  }

  public setContent(content: string) {
    this.instance.content = content;
    return this;
  }

  public setType(type: BlockType) {
    this.instance.type = type;
    return this;
  }
}

export class BlockMother extends ObjectMother<BlockBuilder> {
  public readonly builder = new BlockBuilder();

  public withH2Type() {
    this.builder.setType(BlockType.H2);
    return this;
  }

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
