import { BlockRectStore } from '../../stores/BlockRectStore';
import { BlockStore, BlockType } from '../../stores/BlockStore';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { BlockRectMother } from '../../testUtils/mothers/BlockRectMother';
import { StubDrawer } from '../../testUtils/StubDrawer';
import { RenderService } from './RenderService';

describe(RenderService, () => {
  let drawer: StubDrawer;
  let blockStore: BlockStore;
  let blockRectStore: BlockRectStore;
  let renderService: RenderService;
  let blockMother: BlockMother;
  let blockRectMother: BlockRectMother;

  beforeAll(() => {
    drawer = new StubDrawer();
    blockStore = new BlockStore();
    blockRectStore = new BlockRectStore();
    renderService = new RenderService(drawer, blockStore, blockRectStore);
    blockMother = new BlockMother();
    blockRectMother = new BlockRectMother();

    jest.spyOn(drawer, 'renderText');
  });
  it('renders blocks', () => {
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

  it(`renders the ${BlockType.CreateBlock} with "New +" as the content`, () => {
    blockStore.blocks.set(blockMother.withType(BlockType.CreateBlock).create().id, blockMother.last);

    renderService.render();

    expect(drawer.renderText).toBeCalledWith(1, expect.objectContaining({ content: 'New +' }));
  });
});
