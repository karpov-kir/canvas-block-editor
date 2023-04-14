import { FocusBlockCommand } from '../../../commands/focusBlock/FocusBlockCommand';
import { Vector } from '../../../math/Vector';
import { BlockRectStore } from '../../../stores/BlockRectStore';
import { BlockStore } from '../../../stores/BlockStore';
import { ActiveBlockMother } from '../../../testUtils/mothers/ActiveBlockMother';
import { BlockRectMother } from '../../../testUtils/mothers/BlockRectMother';
import { CommandBus } from '../../../utils/CommandBus';
import { CursorEvent } from '../UserCursorInteractionMediator';
import { clickHandler } from './clickHandler';

describe(clickHandler, () => {
  let commandBus: CommandBus;
  let blockStore: BlockStore;
  let blockRectStore: BlockRectStore;
  let blockRectMother: BlockRectMother;
  let activeBlockMother: ActiveBlockMother;

  beforeEach(() => {
    commandBus = new CommandBus();
    blockStore = new BlockStore();
    blockRectStore = new BlockRectStore();
    blockRectMother = new BlockRectMother();
    activeBlockMother = new ActiveBlockMother();

    blockStore.add('text');
    blockStore.add('text');
    blockRectStore.attach(1, blockRectMother.withSmallSize().create());
    blockRectStore.attach(2, blockRectMother.withSmallSize().underLast().create());
  });

  it(`emits the ${FocusBlockCommand.name} on a click`, () => {
    const cursorEvent = new CursorEvent('click', {
      position: new Vector(10, 10),
    });
    const focusedBlockHandler = jest.fn();

    commandBus.registerHandler(FocusBlockCommand, focusedBlockHandler);
    clickHandler(cursorEvent, blockStore, blockRectStore, commandBus);

    blockStore.activeBlock = activeBlockMother.create();

    clickHandler(cursorEvent, blockStore, blockRectStore, commandBus);

    expect(focusedBlockHandler).toBeCalledTimes(1);
  });

  it(`does not emit the ${FocusBlockCommand.name} if the clicked block is already active`, () => {
    const cursorEvent = new CursorEvent('click', {
      position: new Vector(10, 10),
    });
    const focusedBlockHandler = jest.fn();

    commandBus.registerHandler(FocusBlockCommand, focusedBlockHandler);
    clickHandler(cursorEvent, blockStore, blockRectStore, commandBus);

    blockStore.activeBlock = activeBlockMother.create();

    clickHandler(cursorEvent, blockStore, blockRectStore, commandBus);

    expect(focusedBlockHandler).toBeCalledTimes(1);
  });
});
