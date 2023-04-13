import { InputCommand } from '../../../commands/input/InputCommand';
import { BlockStore } from '../../../stores/BlockStore';
import { ActiveBlockMother } from '../../../testUtils/mothers/ActiveBlockMother';
import { CommandBus } from '../../../utils/CommandBus';
import { KeyboardEvent } from '../UserKeyboardInteractionMediator';
import { keyPressHandler } from './keyPressHandler';

describe(keyPressHandler, () => {
  let commandBus: CommandBus;
  let blockStore: BlockStore;

  beforeEach(() => {
    commandBus = new CommandBus();
    blockStore = new BlockStore();
  });

  it(`emits the ${InputCommand.name} on a key press`, () => {
    const keyboardEvent = new KeyboardEvent('key-press', 'T');
    const inputCommandHandler = jest.fn();

    blockStore.add('text');
    blockStore.activeBlock = new ActiveBlockMother().build();

    commandBus.registerHandler(InputCommand, inputCommandHandler);
    keyPressHandler(keyboardEvent, blockStore, commandBus);

    expect(inputCommandHandler).toBeCalledWith(expect.any(InputCommand));
  });

  it(`does not emit the ${InputCommand.name} on a key press when there is no an active block`, () => {
    const keyboardEvent = new KeyboardEvent('key-press', 'T');
    const inputCommandHandler = jest.fn();

    commandBus.registerHandler(InputCommand, inputCommandHandler);
    keyPressHandler(keyboardEvent, blockStore, commandBus);

    expect(inputCommandHandler).not.toBeCalled();
  });
});
