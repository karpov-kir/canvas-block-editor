import { ActiveBlock } from '../../stores/BlockStore';
import { BlockMother } from './BlockMother';
import { Builder } from './Builder';
import { ObjectMother } from './ObjectMother';

class ActiveBlockBuilder extends Builder<ActiveBlock> {
  private readonly blockMother = new BlockMother();

  public instance = this.createEmpty();

  public createEmpty(): ActiveBlock {
    return {
      block: this.blockMother.build(),
      carriagePosition: 0,
    };
  }
}

export class ActiveBlockMother extends ObjectMother<ActiveBlockBuilder> {
  public readonly builder = new ActiveBlockBuilder();
}
