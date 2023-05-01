import { BlockStore } from '../../stores/BlockStore';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { InputCommand } from './InputCommand';
import { InputCommandHandler, InputReceivedEvent } from './InputCommandHandler';

describe(InputCommandHandler.name, () => {
  it(`adds some input to the currently focused block and emits the ${InputReceivedEvent.name}`, () => {
    const blockStore = new BlockStore();
    const eventBus = new EventBus();
    const blockMother = new BlockMother();
    const inputReceivedEventHandler = jest.fn();

    eventBus.subscribe(InputReceivedEvent, inputReceivedEventHandler);
    blockStore.blocks.set(blockMother.create().id, blockMother.last);
    blockStore.focusBlock(blockMother.last.id);

    new InputCommandHandler(blockStore, eventBus).execute(new InputCommand(blockMother.last.id, 'Hello world!'));

    expect(blockStore.getFocusedBlockById(blockMother.last.id)).toEqual(
      expect.objectContaining({
        content: 'Hello world!',
      }),
    );
    expect(inputReceivedEventHandler).toBeCalledWith(new InputReceivedEvent(blockMother.last, 'Hello world!'));
  });
});
