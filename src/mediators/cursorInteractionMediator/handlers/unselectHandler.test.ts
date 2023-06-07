import { Selection } from '../../../commands/select/SelectCommand';
import { UnselectCommand } from '../../../commands/unselect/UnselectCommand';
import { BlockStore } from '../../../stores/BlockStore';
import { FakeHandlerStub } from '../../../testUtils/FakeCommandHandler';
import { BlockMother } from '../../../testUtils/mothers/BlockMother';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { CursorInteractionUnselectEvent } from '../CursorInteractionMediator';
import { unselectHandler } from './unselectHandler';

describe(unselectHandler, () => {
  let commandBus: CommandBus;

  beforeEach(() => {
    commandBus = new CommandBus();
  });

  it(`emits the ${UnselectCommand.name} on selection in the focused block`, () => {
    const blockStore = new BlockStore();
    const unselectCommandHandler = new FakeHandlerStub();
    const blockMother = new BlockMother();

    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.setSelection(blockMother.last.id, new Selection(0, 5));
    commandBus.subscribe(UnselectCommand, unselectCommandHandler);

    unselectHandler(new CursorInteractionUnselectEvent(), blockStore, commandBus);

    expect(unselectCommandHandler.execute).toBeCalledWith(expect.any(UnselectCommand));
  });
});
