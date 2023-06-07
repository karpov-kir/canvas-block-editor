import { BlockRectStore } from '../../stores/BlockRectStore';
import { BlockStore, BlockType } from '../../stores/BlockStore';
import { DocumentStore } from '../../stores/DocumentStore';
import { FakeDrawer } from '../../testUtils/FakeDrawer';
import { BlockMother } from '../../testUtils/mothers/BlockMother';
import { BlockRectMother } from '../../testUtils/mothers/BlockRectMother';
import { Dimensions } from '../../utils/math/Dimensions';
import { Vector } from '../../utils/math/Vector';
import { RenderService } from './RenderService';

// describe(RenderService.name, () => {
describe('test', () => {
  let fakeDrawer: FakeDrawer;
  let blockStore: BlockStore;
  let blockRectStore: BlockRectStore;
  let renderService: RenderService;
  let blockMother: BlockMother;
  let blockRectMother: BlockRectMother;
  let documentStore: DocumentStore;

  beforeEach(() => {
    fakeDrawer = new FakeDrawer();
    blockStore = new BlockStore();
    blockRectStore = new BlockRectStore();
    documentStore = new DocumentStore();
    renderService = new RenderService(fakeDrawer, blockStore, blockRectStore, documentStore);
    blockMother = new BlockMother();
    blockRectMother = new BlockRectMother();

    documentStore.dimensions = new Dimensions(100, 100);
    documentStore.maxContentWidth = 100;
    documentStore.minContentWidth = 90;
  });

  it('clears the canvas on every render', () => {
    renderService.render();
    renderService.render();

    expect(fakeDrawer.clear).toBeCalledTimes(2);
  });

  it('renders text of blocks one under another', () => {
    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.blocks.set(blockMother.withLongContent().create().id, blockMother.last);

    renderService.render();

    expect(fakeDrawer.textContentRect).toBeCalledTimes(2);
    expect(fakeDrawer.textContentRect).nthCalledWith(1, expect.objectContaining({ position: { x: 0, y: 0 } }));
    expect(fakeDrawer.textContentRect).nthCalledWith(2, expect.objectContaining({ position: { x: 0, y: 41 } }));
  });

  it('renders blocks one under another and for the whole available width', () => {
    documentStore.maxContentWidth = 800;
    documentStore.dimensions = new Dimensions(1000, 500);

    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.blocks.set(blockMother.withLongContent().create().id, blockMother.last);

    renderService.render();

    expect(fakeDrawer.rect).toBeCalledTimes(2);
    expect(fakeDrawer.rect).nthCalledWith(
      1,
      expect.objectContaining({
        // 5 comes from margins
        position: new Vector(105, 5),
        dimensions: new Dimensions(790, 30),
      }),
    );
    expect(fakeDrawer.rect).nthCalledWith(
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

    expect(fakeDrawer.rect).toBeCalledWith(
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
    expect(blockRectStore.blockRects.get(blockMother.beforeLast.id)).toEqual({
      ...blockRectMother.withContent().create(),
      blockId: blockMother.beforeLast.id,
    });
    expect(blockRectStore.blockRects.get(blockMother.last.id)).toEqual({
      ...blockRectMother.withLongContent().underLast().create(),
      blockId: blockMother.last.id,
    });
  });

  it('strokes unfocused and unhovered blocks in gray color', () => {
    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);

    renderService.render();

    expect(fakeDrawer.rect).toBeCalledTimes(1);
    expect(fakeDrawer.rect).toBeCalledWith(
      expect.objectContaining({
        strokeStyle: 'gray',
      }),
    );
  });

  it('strokes the highlighted block in red color', () => {
    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.highlightBlock(blockMother.last.id);

    renderService.render();

    expect(fakeDrawer.rect).toBeCalledTimes(1);
    expect(fakeDrawer.rect).toBeCalledWith(
      expect.objectContaining({
        strokeStyle: 'red',
      }),
    );
  });

  it('strokes the focused block in green color', () => {
    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.focusBlock(blockMother.last.id);

    renderService.render();

    expect(fakeDrawer.rect).toBeCalledTimes(1);
    expect(fakeDrawer.rect).toBeCalledWith(
      expect.objectContaining({
        strokeStyle: 'green',
      }),
    );
  });

  it('renders a block as focused only (in green color) even if it is focused and highlighted at the same time', () => {
    blockStore.blocks.set(blockMother.withContent().create().id, blockMother.last);
    blockStore.focusBlock(blockMother.last.id);
    blockStore.highlightBlock(blockMother.last.id);

    renderService.render();

    expect(fakeDrawer.rect).toBeCalledTimes(1);
    expect(fakeDrawer.rect).toBeCalledWith(
      expect.objectContaining({
        strokeStyle: 'green',
      }),
    );
  });

  it('renders the focused block (in green color) and the highlighted block (in red color) if they are different blocks', () => {
    blockStore.blocks.set(blockMother.create().id, blockMother.last);
    blockStore.highlightBlock(blockMother.last.id);
    blockStore.blocks.set(blockMother.create().id, blockMother.last);
    blockStore.focusBlock(blockMother.last.id);

    renderService.render();

    expect(fakeDrawer.rect).toBeCalledTimes(2);
    expect(fakeDrawer.rect).toBeCalledWith(
      expect.objectContaining({
        strokeStyle: 'green',
      }),
    );
    expect(fakeDrawer.rect).toBeCalledWith(
      expect.objectContaining({
        strokeStyle: 'red',
      }),
    );
  });

  it(`renders a block with type "${BlockType.CreateBlock}" with "New +" as the content`, () => {
    blockStore.blocks.set(blockMother.withType(BlockType.CreateBlock).create().id, blockMother.last);

    renderService.render();

    expect(fakeDrawer.textContentRect).toBeCalledWith(expect.objectContaining({ text: 'New +' }));
  });
});
