import { SelectCommand, Selection } from '../../../commands/select/SelectCommand';
import { BlockStore } from '../../../stores/BlockStore';
import { CommandHandlerStub } from '../../../testUtils/CommandHandlerStub';
import { ActiveBlockMother } from '../../../testUtils/mothers/ActiveBlockMother';
import { BlockMother } from '../../../testUtils/mothers/BlockMother';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { CursorInteractionSelectEvent } from '../CursorInteractionMediator';
import { selectHandler } from './selectHandler';

describe(selectHandler, () => {
  let commandBus: CommandBus;

  beforeEach(() => {
    commandBus = new CommandBus();
  });

  it(`emits the ${SelectCommand.name} on a double click`, () => {
    const blockStore = new BlockStore();
    const selectCommandHandler = new CommandHandlerStub();
    const blockMother = new BlockMother();
    const activeBlockMother = new ActiveBlockMother();

    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.activeBlock = activeBlockMother.withBlock(blockMother.last).create();

    commandBus.subscribe(SelectCommand, selectCommandHandler);
    selectHandler(new CursorInteractionSelectEvent(new Selection(0, 1)), blockStore, commandBus);

    expect(selectCommandHandler.execute).toBeCalledWith(expect.any(SelectCommand));
  });
});
