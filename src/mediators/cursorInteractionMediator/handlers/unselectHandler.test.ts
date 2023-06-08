import { RemoveSelectionFromBlockCommand } from '../../../commands/removeSelectionFromBlock/RemoveSelectionFromBlockCommand';
import { Selection } from '../../../commands/selectInBlock/SelectInBlockCommand';
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

  it(`emits the ${RemoveSelectionFromBlockCommand.name} on selection in the focused block`, () => {
    const blockStore = new BlockStore();
    const RemoveSelectionFromBlockCommandHandler = new FakeHandlerStub();
    const blockMother = new BlockMother();

    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.setSelection(blockMother.last.id, new Selection(0, 5));
    commandBus.subscribe(RemoveSelectionFromBlockCommand, RemoveSelectionFromBlockCommandHandler);

    unselectHandler(new CursorInteractionUnselectEvent(), blockStore, commandBus);

    expect(RemoveSelectionFromBlockCommandHandler.execute).toBeCalledWith(expect.any(RemoveSelectionFromBlockCommand));
  });
});
