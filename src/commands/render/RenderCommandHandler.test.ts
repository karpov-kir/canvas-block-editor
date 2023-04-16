import { BlockRectStore } from '../../stores/BlockRectStore';
import { BlockStore, BlockType } from '../../stores/BlockStore';
import { DocumentStore } from '../../stores/DocumentStore';
import { StubDrawer } from '../../testUtils/StubDrawer';
import { EventBus } from '../../utils/pubSub/EventBus';
import { RenderCommand } from './RenderCommand';
import { RenderCommandHandler, RenderedEvent } from './RenderCommandHandler';
import { RenderService } from './RenderService';

describe(RenderCommandHandler, () => {
  it(`renders blocks and emits ${RenderedEvent}`, () => {
    const blockStore = new BlockStore();
    const renderService = new RenderService(
      new StubDrawer(),
      new BlockStore(),
      new BlockRectStore(),
      new DocumentStore(),
    );
    const eventBus = new EventBus();
    const handler = new RenderCommandHandler(renderService, eventBus);
    const command = new RenderCommand();
    const renderedHandler = jest.fn();

    jest.spyOn(renderService, 'render');

    eventBus.subscribe(RenderedEvent, renderedHandler);
    blockStore.add(BlockType.Text);
    handler.execute(command);

    expect(renderService.render).toBeCalled();
    expect(renderedHandler).toBeCalledWith(new RenderedEvent());
  });
});
