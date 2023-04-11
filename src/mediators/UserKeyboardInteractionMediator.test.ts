import { Block, BlockStore } from '../BlockStore';
import { InputCommand } from '../commands/inputCommand/InputCommand';
import { CommandBus } from '../utils/CommandBus';
import { KeyboardEvent, UserKeyboardInteractionMediator } from './UserKeyboardInteractionMediator';

describe(UserKeyboardInteractionMediator, () => {
  let commandBus: CommandBus;
  let blockStore: BlockStore;
  let mediator: UserKeyboardInteractionMediator;

  beforeEach(() => {
    commandBus = new CommandBus();
    blockStore = new BlockStore();
    mediator = new UserKeyboardInteractionMediator(commandBus, blockStore);
  });

  it(`emits the ${InputCommand.name} on a key press`, () => {
    const keyboardEvent = new KeyboardEvent('key-press', 'T');
    const inputCommandHandler = jest.fn();

    blockStore.add('text');
    blockStore.activeBlock = {
      block: blockStore.blocks.get(0) as Block,
      carriagePosition: 0,
    };

    commandBus.registerHandler(InputCommand, inputCommandHandler);
    mediator.notify(keyboardEvent);

    expect(inputCommandHandler).toBeCalledWith(expect.any(InputCommand));
  });

  it(`does not emit the ${InputCommand.name} on a key press when there is no an active block`, () => {
    const keyboardEvent = new KeyboardEvent('key-press', 'T');
    const inputCommandHandler = jest.fn();

    commandBus.registerHandler(InputCommand, inputCommandHandler);
    mediator.notify(keyboardEvent);

    expect(inputCommandHandler).not.toBeCalled();
  });
});
