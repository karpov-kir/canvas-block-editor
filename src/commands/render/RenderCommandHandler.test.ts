import { BlockRectStore } from '../../stores/BlockRectStore';
import { BlockStore, BlockType } from '../../stores/BlockStore';
import { StubDrawer } from '../../testUtils/StubDrawer';
import { RenderCommand } from './RenderCommand';
import { RenderCommandHandler } from './RenderCommandHandler';
import { RenderService } from './RenderService';

describe(RenderCommandHandler, () => {
  it('renders blocks', () => {
    const blockStore = new BlockStore();
    const renderService = new RenderService(new StubDrawer(), new BlockStore(), new BlockRectStore());
    const handler = new RenderCommandHandler(renderService);
    const command = new RenderCommand();

    jest.spyOn(renderService, 'render');

    blockStore.add(BlockType.Text);
    handler.execute(command);

    expect(renderService.render).toBeCalled();
  });
});
