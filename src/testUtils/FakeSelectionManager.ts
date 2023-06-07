import { Selection } from '../commands/select/SelectCommand';
import { SelectCommandHandler, SelectionManager, UnselectCommandHandler } from '../sagas/SelectionSaga';
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
      select: SelectCommandHandler;
      unselect: UnselectCommandHandler;
    }>(),
  ) {}

  public enable = jest.fn((_blockId: number) => {
    this.#isEnabled = true;
  });

  public disable = jest.fn(() => {
    this.#isEnabled = false;
  });

  public resetPosition = jest.fn(() => {
    return undefined;
  });

  public update = jest.fn(() => {
    return undefined;
  });

  public onSelect = jest.fn((handler: SelectCommandHandler) => {
    this.pubSub.subscribe('select', handler);
  });

  public onUnselect = jest.fn((handler: UnselectCommandHandler) => {
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
