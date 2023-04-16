import { BlockRectStore } from '../../stores/BlockRectStore';
import { BlockStore, BlockType } from '../../stores/BlockStore';
import { DocumentStore } from '../../stores/DocumentStore';
import { ActiveBlockMother } from '../../testUtils/mothers/ActiveBlockMother';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { BlockRectMother } from '../../testUtils/mothers/BlockRectMother';
import { StubDrawer } from '../../testUtils/StubDrawer';
import { Dimensions } from '../../utils/math/Dimensions';
import { RenderService } from './RenderService';

describe(RenderService, () => {
  let drawer: StubDrawer;
  let blockStore: BlockStore;
  let blockRectStore: BlockRectStore;
  let renderService: RenderService;
  let blockMother: BlockMother;
  let activeBlockMother: ActiveBlockMother;
  let blockRectMother: BlockRectMother;
  let documentStore: DocumentStore;

  beforeEach(() => {
    drawer = new StubDrawer();
    blockStore = new BlockStore();
    blockRectStore = new BlockRectStore();
    documentStore = new DocumentStore();
    renderService = new RenderService(drawer, blockStore, blockRectStore, documentStore);
    blockMother = new BlockMother();
    blockRectMother = new BlockRectMother();
    activeBlockMother = new ActiveBlockMother(blockMother);

    documentStore.dimensions = new Dimensions(100, 100);
    documentStore.maxContentWidth = 100;
  });

  it('clears canvas on every render', () => {
    renderService.render();
    renderService.render();

    expect(drawer.clear).toBeCalledTimes(2);
  });

  it('renders text of blocks one under another', () => {
    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.blocks.set(blockMother.withLongContent().create().id, blockMother.last);

    renderService.render();

    expect(drawer.text).toBeCalledTimes(2);
    expect(drawer.text).nthCalledWith(1, expect.objectContaining({ x: 0, y: 0 }));
    expect(drawer.text).nthCalledWith(2, expect.objectContaining({ x: 0, y: 31 }));
  });

  it('renders blocks one under another and for the whole available width', () => {
    documentStore.maxContentWidth = 800;
    documentStore.dimensions = new Dimensions(1000, 500);

    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.blocks.set(blockMother.withLongContent().create().id, blockMother.last);

    renderService.render();

    expect(drawer.rect).toBeCalledTimes(2);
    expect(drawer.rect).nthCalledWith(
      1,
      expect.objectContaining({
        // 5 comes from margins
        x: 105,
        y: 5,
        width: 790,
      }),
    );
    expect(drawer.rect).nthCalledWith(
      2,
      expect.objectContaining({
        // 5 comes from margins
        x: 105,
        y: 36,
        width: 790,
      }),
    );
  });
  });

  it('creates block rects', () => {
    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.blocks.set(blockMother.withLongContent().create().id, blockMother.last);

    renderService.render();

    expect(blockRectStore.blockRects.size).toBe(2);
    expect(blockRectStore.blockRects.get(blockMother.lastTwo[0].id)).toEqual({
      ...blockRectMother.withSmallSize().create(),
      blockId: blockMother.lastTwo[0].id,
    });
    expect(blockRectStore.blockRects.get(blockMother.lastTwo[1].id)).toEqual({
      ...blockRectMother.withSmallSize().underLast().create(),
      blockId: blockMother.lastTwo[1].id,
    });
  });

  it('strokes inactive blocks in gray color', () => {
    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);

    renderService.render();

    expect(drawer.rect).toBeCalledTimes(1);
    expect(drawer.rect).toBeCalledWith(
      expect.objectContaining({
        strokeStyle: 'gray',
      }),
    );
  });

  it('strokes the highlighted block in red color', () => {
    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.highlightedBlock = blockMother.last;

    renderService.render();

    expect(drawer.rect).toBeCalledTimes(1);
    expect(drawer.rect).toBeCalledWith(
      expect.objectContaining({
        strokeStyle: 'red',
      }),
    );
  });

  it('strokes the active block in green color', () => {
    blockStore.activeBlock = activeBlockMother.create();
    blockStore.blocks.set(activeBlockMother.last.block.id, activeBlockMother.last.block);

    renderService.render();

    expect(drawer.rect).toBeCalledTimes(1);
    expect(drawer.rect).toBeCalledWith(
      expect.objectContaining({
        strokeStyle: 'green',
      }),
    );
  });

  it('renders a block as active only if it is active and highlighted at the same time', () => {
    blockStore.activeBlock = activeBlockMother.create();
    blockStore.highlightedBlock = blockStore.activeBlock.block;
    blockStore.blocks.set(activeBlockMother.last.block.id, activeBlockMother.last.block);

    renderService.render();

    expect(drawer.rect).toBeCalledTimes(1);
    expect(drawer.rect).toBeCalledWith(
      expect.objectContaining({
        strokeStyle: 'green',
      }),
    );
  });

  it('renders the active and the highlighted block if they are different blocks', () => {
    blockStore.highlightedBlock = blockMother.create();
    blockStore.activeBlock = activeBlockMother.create();
    blockStore.blocks.set(blockStore.highlightedBlock.id, blockStore.highlightedBlock);
    blockStore.blocks.set(blockStore.activeBlock.block.id, blockStore.activeBlock.block);

    renderService.render();

    expect(drawer.rect).toBeCalledTimes(2);
    expect(drawer.rect).toBeCalledWith(
      expect.objectContaining({
        strokeStyle: 'green',
      }),
    );
    expect(drawer.rect).toBeCalledWith(
      expect.objectContaining({
        strokeStyle: 'red',
      }),
    );
  });

  it(`renders the ${BlockType.CreateBlock} with "New +" as the content`, () => {
    blockStore.blocks.set(blockMother.withType(BlockType.CreateBlock).create().id, blockMother.last);

    renderService.render();

    expect(drawer.text).toBeCalledWith(expect.objectContaining({ text: 'New +' }));
  });
});
