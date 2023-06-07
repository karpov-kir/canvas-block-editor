import { SelectCommand, Selection } from '../../../commands/select/SelectCommand';
import { BlockStore } from '../../../stores/BlockStore';
import { CommandHandlerStub } from '../../../testUtils/CommandHandlerStub';
import { BlockMother } from '../../../testUtils/mothers/BlockMother';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { CursorInteractionSelectEvent } from '../CursorInteractionMediator';
import { selectHandler } from './selectHandler';

describe(selectHandler, () => {
  let commandBus: CommandBus;

  beforeEach(() => {
    commandBus = new CommandBus();
  });

  it(`emits the ${SelectCommand.name} on selection in the focused block`, () => {
    const blockStore = new BlockStore();
    const selectCommandHandler = new CommandHandlerStub();
    const blockMother = new BlockMother();

    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    commandBus.subscribe(SelectCommand, selectCommandHandler);

    selectHandler(new CursorInteractionSelectEvent(blockMother.last.id, new Selection(0, 1)), commandBus);

    expect(selectCommandHandler.execute).toBeCalledWith(expect.any(SelectCommand));
  });
});
