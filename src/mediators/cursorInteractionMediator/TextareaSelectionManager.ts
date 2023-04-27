import { Selection } from '../../commands/select/SelectCommand';
import { SelectHandler, SelectionManager, UnselectHandler } from '../../sagas/SelectionSaga';
import { BlockRectStore } from '../../stores/BlockRectStore';
import { BlockStore } from '../../stores/BlockStore';
import { MultiChannelPubSub } from '../../utils/pubSub/PubSub';

export class TextareaSelectionManager implements SelectionManager {
  #isEnabled = false;

  public get isEnabled() {
    return this.#isEnabled;
  }

  constructor(
    private readonly blockStore: BlockStore,
    private readonly blockRectStore: BlockRectStore,
    private readonly textarea = document.createElement('textarea'),
    private readonly pubSub = new MultiChannelPubSub<{
      select: SelectHandler;
      unselect: UnselectHandler;
    }>(),
  ) {
    document.body.append(this.textarea);

    this.textarea.style.position = 'absolute';
    this.textarea.style.margin = '0px';
    this.textarea.style.padding = '0px';
    this.textarea.style.border = '0px';
    this.textarea.style.outline = '0px';
    this.textarea.style.right = '0px';
    this.textarea.style.color = 'transparent';
    this.textarea.style.background = 'transparent';
    this.textarea.style.verticalAlign = 'center';
    this.textarea.style.textAlign = 'left';
    this.textarea.style.resize = 'none';
    this.textarea.style.overflow = 'hidden';
    this.textarea.style.display = 'none';
    this.textarea.style.wordBreak = 'break-all';
    this.textarea.style.opacity = '0';

    this.textarea.value = '';
    this.textarea.readOnly = true;

    this.resetPosition();

    // https://stackoverflow.com/questions/48633149/disable-drag-and-drop-of-selected-text
    const eventsToPrevent = ['copy', 'paste', 'cut', 'dragstart'];
    eventsToPrevent.forEach((type) => {
      this.textarea.addEventListener(type, function (event) {
        event.preventDefault();
      });
    });

    document.addEventListener('mousedown', () => {
      this.pubSub.publish('unselect', undefined);
    });

    document.addEventListener('selectionchange', (_event) => {
      if (document.activeElement !== this.textarea) {
        return;
      }

      if (this.textarea.selectionStart !== this.textarea.selectionEnd) {
        this.pubSub.publish('select', new Selection(this.textarea.selectionStart, this.textarea.selectionEnd));
      }
    });
  }

  public enable() {
    this.#isEnabled = true;
    this.textarea.style.display = 'block';
  }

  public disable() {
    this.#isEnabled = false;
    this.textarea.style.display = 'none';
  }

  public resetPosition() {
    this.textarea.style.width = '0px';
    this.textarea.style.height = '0px';
    this.textarea.style.left = '0px';
    this.textarea.style.top = '0px';
  }

  public update() {
    if (!this.#isEnabled) {
      return;
    }

    const activeBlock = this.blockStore.activeBlock;

    if (!activeBlock) {
      throw new Error('No active block');
    }

    const blockRect = this.blockRectStore.blockRects.get(activeBlock.block.id);

    if (!blockRect) {
      throw new Error('No block rect');
    }

    const { dimensions: textDimensions, fontSize, fontFamily, lineHeight, position } = blockRect.contentRect;

    this.textarea.style.top = `${position.y}px`;
    this.textarea.style.left = `${position.x}px`;
    this.textarea.style.font = `${fontSize}px ${fontFamily}`;
    this.textarea.style.lineHeight = `${lineHeight}px`;
    this.textarea.style.width = `${textDimensions.width}px`;
    this.textarea.style.height = `${textDimensions.height}px`;
    this.textarea.value = activeBlock.block.content;
  }

  public onSelect(handler: SelectHandler) {
    this.pubSub.subscribe('select', handler);
  }

  public onUnselect(handler: UnselectHandler) {
    this.pubSub.subscribe('unselect', handler);
  }
}
