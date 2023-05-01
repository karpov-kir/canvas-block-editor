import { Selection } from '../../commands/select/SelectCommand';
import { SelectCommandHandler, SelectionManager, UnselectCommandHandler } from '../../sagas/SelectionSaga';
import { BlockRectStore } from '../../stores/BlockRectStore';
import { BlockStore } from '../../stores/BlockStore';
import { MultiChannelPubSub } from '../../utils/pubSub/PubSub';

export class TextareaSelectionManager implements SelectionManager {
  #isEnabled = false;

  private blockId?: number;

  private readonly textareaElement = document.createElement('textarea');
  private readonly pubSub = new MultiChannelPubSub<{
    select: SelectCommandHandler;
    unselect: UnselectCommandHandler;
  }>();

  public get isEnabled() {
    return this.#isEnabled;
  }

  constructor(
    private readonly blockStore: BlockStore,
    private readonly blockRectStore: BlockRectStore,
    containerElement: HTMLDivElement,
  ) {
    resetTextarea(this.textareaElement);
    preventTextareaShortcuts(this.textareaElement);
    containerElement.append(this.textareaElement);

    this.resetPosition();

    document.addEventListener('mousedown', () => {
      this.pubSub.publish('unselect', undefined);
    });

    document.addEventListener('selectionchange', (_event) => {
      this.handleSelectionChange();
    });
  }

  private handleSelectionChange() {
    if (document.activeElement !== this.textareaElement) {
      return;
    }

    if (!this.blockId) {
      throw new Error('Block ID is not set');
    }

    if (this.textareaElement.selectionStart !== this.textareaElement.selectionEnd) {
      this.pubSub.publish('select', {
        blockId: this.blockId,
        selection: new Selection(this.textareaElement.selectionStart, this.textareaElement.selectionEnd),
      });
    }
  }

  public enable(blockId: number) {
    this.blockId = blockId;
    this.#isEnabled = true;
    this.textareaElement.style.display = 'block';
  }

  public disable() {
    this.blockId = undefined;
    this.#isEnabled = false;
    this.textareaElement.style.display = 'none';
  }

  public resetPosition() {
    this.textareaElement.style.width = '0px';
    this.textareaElement.style.height = '0px';
    this.textareaElement.style.left = '0px';
    this.textareaElement.style.top = '0px';
  }

  public update() {
    if (!this.#isEnabled) {
      return;
    }

    if (!this.blockId) {
      throw new Error('Block ID is not set');
    }

    const block = this.blockStore.getById(this.blockId);
    const blockRect = this.blockRectStore.getById(this.blockId);
    const { dimensions: textDimensions, fontSize, fontFamily, lineHeight, position } = blockRect.contentRect;

    this.textareaElement.style.top = `${position.y}px`;
    this.textareaElement.style.left = `${position.x}px`;
    this.textareaElement.style.font = `${fontSize}px ${fontFamily}`;
    this.textareaElement.style.lineHeight = `${lineHeight}px`;
    this.textareaElement.style.width = `${textDimensions.width}px`;
    this.textareaElement.style.height = `${textDimensions.height}px`;
    this.textareaElement.value = block.content;
  }

  public onSelect(handler: SelectCommandHandler) {
    this.pubSub.subscribe('select', handler);
  }

  public onUnselect(handler: UnselectCommandHandler) {
    this.pubSub.subscribe('unselect', handler);
  }
}

function resetTextarea(textareaElement: HTMLTextAreaElement) {
  textareaElement.style.position = 'absolute';
  textareaElement.style.margin = '0px';
  textareaElement.style.padding = '0px';
  textareaElement.style.border = '0px';
  textareaElement.style.outline = '0px';
  textareaElement.style.right = '0px';
  textareaElement.style.color = 'transparent';
  textareaElement.style.background = 'transparent';
  textareaElement.style.verticalAlign = 'center';
  textareaElement.style.textAlign = 'left';
  textareaElement.style.resize = 'none';
  textareaElement.style.overflow = 'hidden';
  textareaElement.style.display = 'none';
  textareaElement.style.wordBreak = 'break-all';
  textareaElement.style.opacity = '0';

  textareaElement.value = '';
  textareaElement.readOnly = true;
}

function preventTextareaShortcuts(textareaElement: HTMLTextAreaElement) {
  // https://stackoverflow.com/questions/48633149/disable-drag-and-drop-of-selected-text
  const eventsToPrevent = ['copy', 'paste', 'cut', 'dragstart'];
  eventsToPrevent.forEach((type) => {
    textareaElement.addEventListener(type, function (event) {
      event.preventDefault();
    });
  });
}
