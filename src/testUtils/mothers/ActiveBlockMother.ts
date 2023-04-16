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

  constructor(blockMother: BlockMother = new BlockMother()) {
    super();
    this.builder = new ActiveBlockBuilder(blockMother);
  }
}
