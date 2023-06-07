import { InputCommand } from '../../../commands/input/InputCommand';
import { BlockStore } from '../../../stores/BlockStore';
import { FakeHandlerStub } from '../../../testUtils/FakeCommandHandler';
import { BlockMother } from '../../../testUtils/mothers/BlockMother';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { KeyboardInteractionKeyPressEvent } from '../KeyboardInteractionMediator';
import { keyPressHandler } from './keyPressHandler';

describe(keyPressHandler, () => {
  let commandBus: CommandBus;
  let blockStore: BlockStore;
  let blockMother: BlockMother;

  beforeEach(() => {
    commandBus = new CommandBus();
    blockStore = new BlockStore();
    blockMother = new BlockMother();

    blockStore.blocks.set(blockMother.create().id, blockMother.last);
  });

  it(`emits the ${InputCommand.name} on a key press`, () => {
    const inputCommandHandler = new FakeHandlerStub();

    blockStore.focusBlock(blockMother.last.id);
    commandBus.subscribe(InputCommand, inputCommandHandler);

    keyPressHandler(new KeyboardInteractionKeyPressEvent('T'), blockStore, commandBus);

    expect(inputCommandHandler.execute).toBeCalledWith(expect.any(InputCommand));
  });

  it(`does not emit the ${InputCommand.name} on a key press when there is no focused blocks`, () => {
    const inputCommandHandler = new FakeHandlerStub();

    commandBus.subscribe(InputCommand, inputCommandHandler);

    keyPressHandler(new KeyboardInteractionKeyPressEvent('T'), blockStore, commandBus);

    expect(inputCommandHandler.execute).not.toBeCalled();
  });
});
