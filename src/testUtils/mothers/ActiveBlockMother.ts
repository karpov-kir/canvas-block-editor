import { ActiveBlock } from '../../stores/BlockStore';
import { BlockMother } from './BlockMother';
import { Builder } from './Builder';
import { ObjectMother } from './ObjectMother';

class ActiveBlockBuilder extends Builder<ActiveBlock> {
  private readonly blockMother: BlockMother;
  public instance: ActiveBlock;

  constructor(blockMother: BlockMother) {
    super();
    this.blockMother = blockMother;
    this.instance = this.createEmpty();
  }

  public createEmpty(): ActiveBlock {
    return {
      block: this.blockMother.create(),
      carriagePosition: 0,
    };
  }
}

export class ActiveBlockMother extends ObjectMother<ActiveBlockBuilder> {
  public readonly builder: ActiveBlockBuilder;

  constructor(private readonly blockMother: BlockMother = new BlockMother()) {
    super();
    this.builder = new ActiveBlockBuilder(blockMother);
  }

  public withContent() {
    this.builder.instance.block = {
      ...this.blockMother.withContent().create(),
      id: this.builder.instance.block.id,
    };
    return this;
  }

  public withLongContent() {
    this.builder.instance.block = {
      ...this.blockMother.withLongContent().create(),
      id: this.builder.instance.block.id,
    };
    return this;
  }
}
