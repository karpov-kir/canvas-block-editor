import { BlockRectStore } from '../../stores/BlockRectStore';
import { BlockStore, BlockType } from '../../stores/BlockStore';
import { DocumentStore } from '../../stores/DocumentStore';
import { StubDrawer } from '../../testUtils/StubDrawer';
import { EventBus } from '../../utils/pubSub/EventBus';
import { RenderCommand } from './RenderCommand';
import { RenderCommandHandler, RenderedEvent } from './RenderCommandHandler';
import { RenderService } from './RenderService';

describe(RenderCommandHandler.name, () => {
  it(`renders blocks and emits ${RenderedEvent.name}`, () => {
    const blockStore = new BlockStore();
    const renderService = new RenderService(
      new StubDrawer(),
      new BlockStore(),
      new BlockRectStore(),
      new DocumentStore(),
    );
    const eventBus = new EventBus();
    const renderedEventHandler = jest.fn();

    jest.spyOn(renderService, 'render');

    eventBus.subscribe(RenderedEvent, renderedEventHandler);
    blockStore.add(BlockType.Text);
    new RenderCommandHandler(renderService, eventBus).execute(new RenderCommand());

    expect(renderService.render).toBeCalled();
    expect(renderedEventHandler).toBeCalledWith(new RenderedEvent());
  });
});
