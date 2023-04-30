import { ActiveBlock, Block } from '../../stores/BlockStore';
import { BlockMother } from './BlockMother';
import { Builder } from './Builder';
import { ObjectMother } from './ObjectMother';

class ActiveBlockBuilder extends Builder<ActiveBlock> {
  private readonly blockMother: BlockMother;
  public override instance: ActiveBlock;

  constructor(blockMother: BlockMother) {
    super();
    this.blockMother = blockMother;
    this.instance = this.createEmpty();
  }

  public override createEmpty(): ActiveBlock {
    return {
      block: this.blockMother.create(),
      carriagePosition: 0,
    };
  }
}

export class ActiveBlockMother extends ObjectMother<ActiveBlockBuilder> {
  public override readonly builder: ActiveBlockBuilder;

  constructor(blockMother: BlockMother = new BlockMother()) {
    super();
    this.builder = new ActiveBlockBuilder(blockMother);
  }

  public withBlock(block: Block) {
    this.builder.instance.block = block;
    return this;
  }
}
