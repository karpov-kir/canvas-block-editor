import { BlockStore } from '../../BlockStore';
import { StubDrawer } from '../../testUtils/StubDrawer';
import { RenderCommand } from './RenderCommand';
import { RenderCommandHandler } from './RenderCommandHandler';
import { RenderService } from './RenderService';

describe(RenderCommandHandler, () => {
  it('renders blocks', () => {
    const blockStore = new BlockStore();
    const renderService = new RenderService(new StubDrawer());
    const handler = new RenderCommandHandler(blockStore, renderService);
    const command = new RenderCommand();

    jest.spyOn(renderService, 'render');

    blockStore.add('text');
    handler.execute(command);

    expect(renderService.render).toBeCalledWith(blockStore.blocks);
  });
});