import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { StubDrawer } from '../../testUtils/StubDrawer';
import { RenderService } from './RenderService';

describe(RenderService, () => {
  it('renders blocks', () => {
    const drawer = new StubDrawer();
    const renderService = new RenderService(drawer);
    const blockMother = new BlockMother();

    jest.spyOn(drawer, 'renderText');

    renderService.render(
      new Map([
        [blockMother.createWithContent().id, blockMother.getLast()],
        [blockMother.createWithLongContent().id, blockMother.getLast()],
      ]),
    );

    expect(drawer.renderText).toBeCalledTimes(2);
    expect(drawer.renderText).nthCalledWith(1, expect.objectContaining({ x: 0, y: 0 }));
    expect(drawer.renderText).nthCalledWith(2, expect.objectContaining({ x: 0, y: 30 }));
  });
});
