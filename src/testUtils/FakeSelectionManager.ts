import { Selection } from '../commands/selectInBlock/SelectInBlockCommand';
import { SelectHandler, SelectionManager, UnselectHandler } from '../sagas/SelectionSaga';
import { MultiChannelPubSub } from '../utils/pubSub/PubSub';

export class FakeSelectionManager implements SelectionManager {
  #isEnabled = false;
  #isSelecting = false;

  public get isEnabled() {
    return this.#isEnabled;
  }

  public get isSelecting() {
    return this.#isSelecting;
  }

  constructor(
    private readonly pubSub = new MultiChannelPubSub<{
      select: SelectHandler;
      unselect: UnselectHandler;
    }>(),
  ) {}

  public enable = jest.fn((_blockId: number) => {
    this.#isEnabled = true;
  });

  public disable = jest.fn(() => {
    this.#isEnabled = false;
  });

  public update = jest.fn(() => {
    return undefined;
  });

  public onSelect = jest.fn((handler: SelectHandler) => {
    this.pubSub.subscribe('select', handler);
  });

  public onUnselect = jest.fn((handler: UnselectHandler) => {
    this.pubSub.subscribe('unselect', handler);
  });

  public simulateSelection = jest.fn((blockId: number, selection: Selection) => {
    this.#isSelecting = true;
    this.pubSub.publish('select', { blockId, selection });
  });

  public simulateUnselection = jest.fn(() => {
    this.#isSelecting = false;
    this.pubSub.publish('unselect', undefined);
  });
}
