import { Block, BlockType } from '../../stores/BlockStore';
import { createIdGenerator } from '../../utils/idGenerator';
import { Builder } from './Builder';
import { ObjectMother } from './ObjectMother';

export const content = 'Hello world!';

export const longContentLines = ['This is supposed to be the first line', 'This is supposed to be the second line'];
export const longContent = longContentLines.join(' ');

class BlockBuilder extends Builder<Block> {
  private idGenerator = createIdGenerator();

  public override instance = this.createEmpty();

  public override createEmpty() {
    return {
      id: this.idGenerator(),
      content: '',
      type: BlockType.Text,
      isFocused: false,
      carriagePosition: 0,
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
  public override readonly builder = new BlockBuilder();

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
