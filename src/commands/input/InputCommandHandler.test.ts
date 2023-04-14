import { BlockStore, BlockType } from '../../stores/BlockStore';
import { ActiveBlockMother } from '../../testUtils/mothers/ActiveBlockMother';
import { EventBus } from '../../utils/pubSub/EventBus';
import { InputCommand } from './InputCommand';
import { InputCommandHandler, InputReceivedEvent } from './InputCommandHandler';

describe(InputCommandHandler, () => {
  it(`adds some input to the currently active block and emits the ${InputReceivedEvent}`, () => {
    const blockStore = new BlockStore();
    const eventBus = new EventBus();
    const handler = new InputCommandHandler(blockStore, eventBus);
    const command = new InputCommand('Hello world!');
    const inputReceivedHandler = jest.fn();

    eventBus.subscribe(InputReceivedEvent, inputReceivedHandler);
    blockStore.add(BlockType.Text);
    blockStore.activeBlock = new ActiveBlockMother().create();

    handler.execute(command);

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
