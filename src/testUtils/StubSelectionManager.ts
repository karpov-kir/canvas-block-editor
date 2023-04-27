import { Selection } from '../commands/select/SelectCommand';
import { SelectHandler, SelectionManager, UnselectHandler } from '../sagas/SelectionSaga';
import { MultiChannelPubSub } from '../utils/pubSub/PubSub';

export class StubSelectionManager implements SelectionManager {
  #isEnabled = false;

  public get isEnabled() {
    return this.#isEnabled;
  }

  constructor(
    private readonly pubSub = new MultiChannelPubSub<{
      select: SelectHandler;
      unselect: UnselectHandler;
    }>(),
  ) {}

  public enable = jest.fn(() => {
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

  public onSelect = jest.fn((handler: SelectHandler) => {
    this.pubSub.subscribe('select', handler);
  });

  public onUnselect = jest.fn((handler: UnselectHandler) => {
    this.pubSub.subscribe('unselect', handler);
  });

  public simulateSelection = jest.fn((selection: Selection) => {
    this.pubSub.publish('select', selection);
  });

  public simulateUnselection = jest.fn(() => {
    this.pubSub.publish('unselect', undefined);
  });
}
