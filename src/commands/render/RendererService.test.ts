import { BlockRectStore } from '../../BlockRectStore';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { StubDrawer } from '../../testUtils/StubDrawer';
import { RenderService } from './RenderService';

describe(RenderService, () => {
  it('renders blocks', () => {
    const drawer = new StubDrawer();
    const blockRectStore = new BlockRectStore();
    const renderService = new RenderService(drawer, blockRectStore);
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
    expect(blockRectStore.blockRects.size).toBe(2);
    expect(blockRectStore.blockRects.get(1)).toEqual({
      blockId: 1,
      height: 30,
      padding: [5, 5],
      position: { x: 0, y: 0 },
      width: 100,
    });
    expect(blockRectStore.blockRects.get(2)).toEqual({
      blockId: 2,
      height: 30,
      padding: [5, 5],
      position: { x: 0, y: 30 },
      width: 100,
    });
  });
});
