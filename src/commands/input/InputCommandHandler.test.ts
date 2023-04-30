import { BlockStore } from '../../stores/BlockStore';
import { ActiveBlockMother } from '../../testUtils/mothers/ActiveBlockMother';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { InputCommand } from './InputCommand';
import { InputCommandHandler, InputReceivedEvent } from './InputCommandHandler';

describe(InputCommandHandler.name, () => {
  it(`adds some input to the currently active block and emits the ${InputReceivedEvent.name}`, () => {
    const blockStore = new BlockStore();
    const eventBus = new EventBus();
    const blockMother = new BlockMother();
    const activeBlockMother = new ActiveBlockMother();
    const inputReceivedHandler = jest.fn();

    eventBus.subscribe(InputReceivedEvent, inputReceivedHandler);
    blockStore.blocks.set(blockMother.create().id, blockMother.last);
    blockStore.activeBlock = activeBlockMother.withBlock(blockMother.last).create();

    new InputCommandHandler(blockStore, eventBus).execute(new InputCommand('Hello world!'));

    expect(blockStore.activeBlock).toEqual(
      expect.objectContaining({
        block: expect.objectContaining({
          content: 'Hello world!',
        }),
      }),
    );
    expect(inputReceivedHandler).toBeCalledWith(new InputReceivedEvent(blockStore.activeBlock.block, 'Hello world!'));
  });
});
