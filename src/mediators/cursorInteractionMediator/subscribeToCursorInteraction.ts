import { SelectionManager } from '../../sagas/SelectionSaga';
import { Vector } from '../../utils/math/Vector';
import {
  CursorInteractionClickEvent,
  CursorInteractionMediator,
  CursorInteractionMoveEvent,
  CursorInteractionSelectEvent,
  CursorInteractionUnselectEvent,
} from './CursorInteractionMediator';

export function subscribeToCursorInteraction(
  cursorInteractionMediator: CursorInteractionMediator,
  containerElement: HTMLElement,
  selectionManager: SelectionManager,
) {
  containerElement.addEventListener('mousemove', (event) => {
    cursorInteractionMediator.notify(new CursorInteractionMoveEvent(new Vector(event.clientX, event.clientY)));
  });

  containerElement.addEventListener('click', (event) => {
    cursorInteractionMediator.notify(new CursorInteractionClickEvent(new Vector(event.clientX, event.clientY)));
  });

  selectionManager.onSelect(({ blockId, selection }) => {
    cursorInteractionMediator.notify(new CursorInteractionSelectEvent(blockId, selection));
  });

  selectionManager.onUnselect(() => {
    cursorInteractionMediator.notify(new CursorInteractionUnselectEvent());
  });
}
