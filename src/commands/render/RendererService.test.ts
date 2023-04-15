import { BlockRectStore } from '../../stores/BlockRectStore';
import { BlockStore, BlockType } from '../../stores/BlockStore';
import { ActiveBlockMother } from '../../testUtils/mothers/ActiveBlockMother';
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
  let activeBlockMother: ActiveBlockMother;
  let blockRectMother: BlockRectMother;

  beforeEach(() => {
    drawer = new StubDrawer();
    blockStore = new BlockStore();
    blockRectStore = new BlockRectStore();
    renderService = new RenderService(drawer, blockStore, blockRectStore);
    blockMother = new BlockMother();
    blockRectMother = new BlockRectMother();
    activeBlockMother = new ActiveBlockMother();
  });

  it('renders blocks', () => {
    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.blocks.set(blockMother.withLongContent().create().id, blockMother.last);

    renderService.render();

    expect(drawer.clear).toBeCalledTimes(1);
    expect(drawer.text).toBeCalledTimes(2);
    expect(drawer.text).nthCalledWith(1, expect.objectContaining({ x: 0, y: 0 }));
    expect(drawer.text).nthCalledWith(2, expect.objectContaining({ x: 0, y: 31 }));

    expect(blockRectStore.blockRects.size).toBe(2);
    expect(blockRectStore.blockRects.get(1)).toEqual(blockRectMother.withSmallSize().create());
    expect(blockRectStore.blockRects.get(2)).toEqual(blockRectMother.withSmallSize().underLast().create());
  });

  it('strokes the highlighted block in red color', () => {
    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.highlightedBlock = blockMother.last;

    renderService.render();

    expect(drawer.rect).toBeCalledTimes(1);
    expect(drawer.rect).nthCalledWith(
      1,
      expect.objectContaining({
        strokeStyle: 'red',
      }),
    );
  });

  it('strokes the active block in a green color', () => {
    blockStore.activeBlock = activeBlockMother.create();
    blockStore.blocks.set(activeBlockMother.last.block.id, activeBlockMother.last.block);

    renderService.render();

    expect(drawer.rect).toBeCalledTimes(1);
    expect(drawer.rect).nthCalledWith(
      1,
      expect.objectContaining({
        strokeStyle: 'green',
      }),
    );
  });

  it(`renders the ${BlockType.CreateBlock} with "New +" as the content`, () => {
    blockStore.blocks.set(blockMother.withType(BlockType.CreateBlock).create().id, blockMother.last);

    renderService.render();

    expect(drawer.text).toBeCalledWith(expect.objectContaining({ text: 'New +' }));
  });
});
