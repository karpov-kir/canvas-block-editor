import { SelectInBlockCommand, Selection } from '../../../commands/selectInBlock/SelectInBlockCommand';
import { BlockStore } from '../../../stores/BlockStore';
import { FakeHandlerStub } from '../../../testUtils/FakeCommandHandler';
import { BlockMother } from '../../../testUtils/mothers/BlockMother';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { CursorInteractionSelectEvent } from '../CursorInteractionMediator';
import { selectHandler } from './selectHandler';

describe(selectHandler, () => {
  let commandBus: CommandBus;

  beforeEach(() => {
    commandBus = new CommandBus();
  });

  it(`emits the ${SelectInBlockCommand.name} on selection in the focused block`, () => {
    const blockStore = new BlockStore();
    const SelectInBlockCommandHandler = new FakeHandlerStub();
    const blockMother = new BlockMother();

    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    commandBus.subscribe(SelectInBlockCommand, SelectInBlockCommandHandler);

    selectHandler(new CursorInteractionSelectEvent(blockMother.last.id, new Selection(0, 1)), commandBus);

    expect(SelectInBlockCommandHandler.execute).toBeCalledWith(expect.any(SelectInBlockCommand));
  });
});
