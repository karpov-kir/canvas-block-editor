import { BlockRectStore } from '../../stores/BlockRectStore';
import { BlockStore, BlockType } from '../../stores/BlockStore';
import { DocumentStore } from '../../stores/DocumentStore';
import { ActiveBlockMother } from '../../testUtils/mothers/ActiveBlockMother';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { BlockRectMother } from '../../testUtils/mothers/BlockRectMother';
import { StubDrawer } from '../../testUtils/StubDrawer';
import { Dimensions } from '../../utils/math/Dimensions';
import { Vector } from '../../utils/math/Vector';
import { RenderService } from './RenderService';

// describe(RenderService.name, () => {
describe('test', () => {
  let stubDrawer: StubDrawer;
  let blockStore: BlockStore;
  let blockRectStore: BlockRectStore;
  let renderService: RenderService;
  let blockMother: BlockMother;
  let activeBlockMother: ActiveBlockMother;
  let blockRectMother: BlockRectMother;
  let documentStore: DocumentStore;

  beforeEach(() => {
    stubDrawer = new StubDrawer();
    blockStore = new BlockStore();
    blockRectStore = new BlockRectStore();
    documentStore = new DocumentStore();
    renderService = new RenderService(stubDrawer, blockStore, blockRectStore, documentStore);
    blockMother = new BlockMother();
    blockRectMother = new BlockRectMother();
    activeBlockMother = new ActiveBlockMother(blockMother);

    documentStore.dimensions = new Dimensions(100, 100);
    documentStore.maxContentWidth = 100;
    documentStore.minContentWidth = 90;
  });

  it('clears the canvas on every render', () => {
    renderService.render();
    renderService.render();

    expect(stubDrawer.clear).toBeCalledTimes(2);
  });

  it('renders text of blocks one under another', () => {
    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.blocks.set(blockMother.withLongContent().create().id, blockMother.last);

    renderService.render();

    expect(stubDrawer.textContentRect).toBeCalledTimes(2);
    expect(stubDrawer.textContentRect).nthCalledWith(1, expect.objectContaining({ position: { x: 0, y: 0 } }));
    expect(stubDrawer.textContentRect).nthCalledWith(2, expect.objectContaining({ position: { x: 0, y: 41 } }));
  });

  it('renders blocks one under another and for the whole available width', () => {
    documentStore.maxContentWidth = 800;
    documentStore.dimensions = new Dimensions(1000, 500);

    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.blocks.set(blockMother.withLongContent().create().id, blockMother.last);

    renderService.render();

    expect(stubDrawer.rect).toBeCalledTimes(2);
    expect(stubDrawer.rect).nthCalledWith(
      1,
      expect.objectContaining({
        // 5 comes from margins
        position: new Vector(105, 5),
        dimensions: new Dimensions(790, 30),
      }),
    );
    expect(stubDrawer.rect).nthCalledWith(
      2,
      expect.objectContaining({
        // 5 comes from margins
        position: new Vector(105, 46),
        dimensions: new Dimensions(790, 50),
      }),
    );
  });

  it('renders blocks at least with the minimum content width even if the document width is lesser', () => {
    documentStore.maxContentWidth = 800;
    documentStore.minContentWidth = 100;
    documentStore.dimensions = new Dimensions(
      // Make it lesser than the min content width
      50,
      500,
    );

    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);

    renderService.render();

    expect(stubDrawer.rect).toBeCalledWith(
      expect.objectContaining({
        // 5 comes from margins
        position: new Vector(5, 5),
        dimensions: new Dimensions(90, 30),
      }),
    );
  });

  it('creates block rects', () => {
    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.blocks.set(blockMother.withLongContent().create().id, blockMother.last);

    renderService.render();

    expect(blockRectStore.blockRects.size).toBe(2);
    expect(blockRectStore.blockRects.get(blockMother.lastTwo[0].id)).toEqual({
      ...blockRectMother.withContent().create(),
      blockId: blockMother.lastTwo[0].id,
    });
    expect(blockRectStore.blockRects.get(blockMother.lastTwo[1].id)).toEqual({
      ...blockRectMother.withLongContent().underLast().create(),
      blockId: blockMother.lastTwo[1].id,
    });
  });

  it('strokes inactive blocks in gray color', () => {
    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);

    renderService.render();

    expect(stubDrawer.rect).toBeCalledTimes(1);
    expect(stubDrawer.rect).toBeCalledWith(
      expect.objectContaining({
        strokeStyle: 'gray',
      }),
    );
  });

  it('strokes the highlighted block in red color', () => {
    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.highlightedBlock = blockMother.last;

    renderService.render();

    expect(stubDrawer.rect).toBeCalledTimes(1);
    expect(stubDrawer.rect).toBeCalledWith(
      expect.objectContaining({
        strokeStyle: 'red',
      }),
    );
  });

  it('strokes the active block in green color', () => {
    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.activeBlock = activeBlockMother.withBlock(blockMother.last).create();

    renderService.render();

    expect(stubDrawer.rect).toBeCalledTimes(1);
    expect(stubDrawer.rect).toBeCalledWith(
      expect.objectContaining({
        strokeStyle: 'green',
      }),
    );
  });

  it('renders a block as active only (in green color) even if it is active and highlighted at the same time', () => {
    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.activeBlock = activeBlockMother.withBlock(blockMother.last).create();
    blockStore.highlightedBlock = blockStore.activeBlock.block;

    renderService.render();

    expect(stubDrawer.rect).toBeCalledTimes(1);
    expect(stubDrawer.rect).toBeCalledWith(
      expect.objectContaining({
        strokeStyle: 'green',
      }),
    );
  });

  it('renders the active and the highlighted block if they are different blocks', () => {
    blockStore.blocks.set(blockMother.create().id, blockMother.last);
    blockStore.highlightedBlock = blockMother.last;

    blockStore.blocks.set(blockMother.create().id, blockMother.last);
    blockStore.activeBlock = activeBlockMother.withBlock(blockMother.last).create();

    renderService.render();

    expect(stubDrawer.rect).toBeCalledTimes(2);
    expect(stubDrawer.rect).toBeCalledWith(
      expect.objectContaining({
        strokeStyle: 'green',
      }),
    );
    expect(stubDrawer.rect).toBeCalledWith(
      expect.objectContaining({
        strokeStyle: 'red',
      }),
    );
  });

  it(`renders a block with type "${BlockType.CreateBlock}" with "New +" as the content`, () => {
    blockStore.blocks.set(blockMother.withType(BlockType.CreateBlock).create().id, blockMother.last);

    renderService.render();

    expect(stubDrawer.textContentRect).toBeCalledWith(expect.objectContaining({ text: 'New +' }));
  });
});
