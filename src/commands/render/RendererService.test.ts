import { BlockRectStore } from '../../stores/BlockRectStore';
import { BlockStore } from '../../stores/BlockStore';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { BlockRectMother } from '../../testUtils/mothers/BlockRectMother';
import { StubDrawer } from '../../testUtils/StubDrawer';
import { RenderService } from './RenderService';

describe(RenderService, () => {
  it('renders blocks', () => {
    const drawer = new StubDrawer();
    const blockStore = new BlockStore();
    const blockRectStore = new BlockRectStore();
    const renderService = new RenderService(drawer, blockStore, blockRectStore);
    const blockMother = new BlockMother();
    const blockRectMother = new BlockRectMother();

    jest.spyOn(drawer, 'renderText');

    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.blocks.set(blockMother.withLongContent().create().id, blockMother.last);

    renderService.render();

    expect(drawer.renderText).toBeCalledTimes(2);
    expect(drawer.renderText).nthCalledWith(1, expect.objectContaining({ x: 0, y: 0 }));
    expect(drawer.renderText).nthCalledWith(2, expect.objectContaining({ x: 0, y: 31 }));

    expect(blockRectStore.blockRects.size).toBe(2);
    expect(blockRectStore.blockRects.get(1)).toEqual(blockRectMother.withSmallSize().create());
    expect(blockRectStore.blockRects.get(2)).toEqual(blockRectMother.withSmallSize().underLast().create());
  });
});
