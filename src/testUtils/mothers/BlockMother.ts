import { Block, BlockType } from '../../stores/BlockStore';
import { createIdGenerator } from '../../utils/idGenerator';
import { Builder } from './Builder';
import { ObjectMother } from './ObjectMother';

export const content = 'Hello world!';

export const longContent = "Hello world! But I'm not just a hello world, I'm also a long content that is repeated!"
  .repeat(2)
  .split('!')
  .join('! ');

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

  public withType(type: BlockType) {
    this.builder.setType(type);
    return this;
  }

  public withContent() {
    this.builder.setContent(content);
    return this;
  }

  public withLongContent() {
    this.builder.setContent(longContent);

    return this;
  }
}
