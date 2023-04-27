import { InputCommand } from '../../../commands/input/InputCommand';
import { BlockStore, BlockType } from '../../../stores/BlockStore';
import { CommandHandlerStub } from '../../../testUtils/CommandHandlerStub';
import { ActiveBlockMother } from '../../../testUtils/mothers/ActiveBlockMother';
import { CommandBus } from '../../../utils/pubSub/CommandBus';
import { KeyboardInteractionKeyPressEvent } from '../KeyboardInteractionMediator';
import { keyPressHandler } from './keyPressHandler';

describe(keyPressHandler, () => {
  let commandBus: CommandBus;
  let blockStore: BlockStore;

  beforeEach(() => {
    commandBus = new CommandBus();
    blockStore = new BlockStore();
  });

  it(`emits the ${InputCommand.name} on a key press`, () => {
    const inputCommandHandler = new CommandHandlerStub();

    blockStore.add(BlockType.Text);
    blockStore.activeBlock = new ActiveBlockMother().create();

    commandBus.subscribe(InputCommand, inputCommandHandler);
    keyPressHandler(new KeyboardInteractionKeyPressEvent('T'), blockStore, commandBus);

    expect(inputCommandHandler.execute).toBeCalledWith(expect.any(InputCommand));
  });

  it(`does not emit the ${InputCommand.name} on a key press when there is no an active block`, () => {
    const inputCommandHandler = new CommandHandlerStub();

    commandBus.subscribe(InputCommand, inputCommandHandler);
    keyPressHandler(new KeyboardInteractionKeyPressEvent('T'), blockStore, commandBus);

    expect(inputCommandHandler.execute).not.toBeCalled();
  });
});