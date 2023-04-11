import { StubDrawer } from '../../testUtils/StubDrawer';
import { RenderService } from './RenderService';

describe(RenderService, () => {
  it('renders blocks', () => {
    const drawer = new StubDrawer();
    const renderService = new RenderService(drawer);

    jest.spyOn(drawer, 'renderText');

    renderService.render(
      new Map([
        [1, { id: 1, type: 'text', content: 'Hello'.repeat(10) }],
        [2, { id: 2, type: 'text', content: 'Hello' }],
      ]),
    );

    expect(drawer.renderText).toBeCalledTimes(2);
    expect(drawer.renderText).nthCalledWith(1, expect.objectContaining({ x: 0, y: 0 }));
    expect(drawer.renderText).nthCalledWith(2, expect.objectContaining({ x: 0, y: 30 }));
  });
});
