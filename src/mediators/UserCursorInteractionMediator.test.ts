import { BlockRectStore } from '../BlockRectStore';
import { BlockStore } from '../BlockStore';
import { AddBlockCommand } from '../commands/addBlock/AddBlockCommand';
import { FocusBlockCommand } from '../commands/focusBlock/FocusBlockCommand';
import { HighlightBlockCommand } from '../commands/highlightBlock/HighlightBlockCommand';
import { Vector } from '../math/Vector';
import { BlockRectMother } from '../testUtils/mothers/BlockRectMother';
import { CommandBus } from '../utils/CommandBus';
import { ActiveBlockMother } from './../testUtils/mothers/ActiveBlockMother';
import { CursorEvent, UserCursorInteractionMediator } from './UserCursorInteractionMediator';

describe(UserCursorInteractionMediator, () => {
  let commandBus: CommandBus;
  let mediator: UserCursorInteractionMediator;
  let blockStore: BlockStore;
  let blockRectStore: BlockRectStore;
  let blockRectMother: BlockRectMother;
  let activeBlockMother: ActiveBlockMother;

  beforeEach(() => {
    commandBus = new CommandBus();
    blockStore = new BlockStore();
    blockRectStore = new BlockRectStore();
    mediator = new UserCursorInteractionMediator(commandBus, blockStore, blockRectStore);
    blockRectMother = new BlockRectMother();
    activeBlockMother = new ActiveBlockMother();

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

  it(`emits the ${FocusBlockCommand.name} on a click`, () => {
    const cursorEvent = new CursorEvent('click', {
      position: new Vector(10, 10),
    });
    const focusedBlockHandler = jest.fn();

    commandBus.registerHandler(FocusBlockCommand, focusedBlockHandler);
    mediator.notify(cursorEvent);

    blockStore.activeBlock = activeBlockMother.build();

    mediator.notify(cursorEvent);

    expect(focusedBlockHandler).toBeCalledTimes(1);
  });

  it(`does not emit the ${FocusBlockCommand.name} if the clicked block is already active`, () => {
    const cursorEvent = new CursorEvent('click', {
      position: new Vector(10, 10),
    });
    const focusedBlockHandler = jest.fn();

    commandBus.registerHandler(FocusBlockCommand, focusedBlockHandler);
    mediator.notify(cursorEvent);

    blockStore.activeBlock = activeBlockMother.build();

    mediator.notify(cursorEvent);

    expect(focusedBlockHandler).toBeCalledTimes(1);
  });
});
