import { BlockRectStore } from '../BlockRectStore';
import { BlockStore } from '../BlockStore';
import { AddBlockCommand } from '../commands/addBlock/AddBlockCommand';
import { HighlightBlockCommand } from '../commands/highlightBlock/HighlightBlockCommand';
import { Vector } from '../math/Vector';
import { BlockRectMother } from '../testUtils/mothers/BlockRectMother';
import { CommandBus } from '../utils/CommandBus';
import { CursorEvent, UserCursorInteractionMediator } from './UserCursorInteractionMediator';

describe(UserCursorInteractionMediator, () => {
  let commandBus: CommandBus;
  let mediator: UserCursorInteractionMediator;
  let blockStore: BlockStore;
  let blockRectStore: BlockRectStore;
  let blockRectMother: BlockRectMother;

  beforeEach(() => {
    commandBus = new CommandBus();
    blockStore = new BlockStore();
    blockRectStore = new BlockRectStore();
    mediator = new UserCursorInteractionMediator(commandBus, blockStore, blockRectStore);
    blockRectMother = new BlockRectMother();

    blockStore.add('text');
    blockStore.add('text');
    blockRectStore.attach(1, blockRectMother.withSmallSize().build());
    blockRectStore.attach(2, blockRectMother.withSmallSize().underLast().build());
  });

  it(`emits the ${AddBlockCommand.name} on a double click`, () => {
    const cursorEvent = new CursorEvent('double-click', { position: new Vector() });
    const addBlockHandler = jest.fn();

    commandBus.registerHandler(AddBlockCommand, addBlockHandler);
    mediator.notify(cursorEvent);

    expect(addBlockHandler).toBeCalledWith(expect.any(AddBlockCommand));
  });

  it(`emits the ${HighlightBlockCommand.name} on the first block mouse hover`, () => {
    const cursorEvent = new CursorEvent('move', {
      position: new Vector(10, 10),
    });
    const highlightBlockHandler = jest.fn();

    commandBus.registerHandler(HighlightBlockCommand, highlightBlockHandler);
    mediator.notify(cursorEvent);

    expect(highlightBlockHandler).toBeCalledWith(new HighlightBlockCommand(1));
  });

  it(`emits the ${HighlightBlockCommand.name} on the second block mouse hover`, () => {
    const cursorEvent = new CursorEvent('move', {
      position: new Vector(10, 35),
    });
    const highlightBlockHandler = jest.fn();

    commandBus.registerHandler(HighlightBlockCommand, highlightBlockHandler);
    mediator.notify(cursorEvent);

    expect(highlightBlockHandler).toBeCalledWith(new HighlightBlockCommand(2));
  });

  it(`does not emit the ${HighlightBlockCommand.name} if the hovered block is already highlighted`, () => {
    const cursorEvent = new CursorEvent('move', {
      position: new Vector(10, 10),
    });
    const highlightBlockHandler = jest.fn();

    commandBus.registerHandler(HighlightBlockCommand, highlightBlockHandler);
    mediator.notify(cursorEvent);

    blockStore.highlightedBlock = blockStore.blocks.get(1);

    mediator.notify(cursorEvent);

    expect(highlightBlockHandler).toBeCalledTimes(1);
  });
});
