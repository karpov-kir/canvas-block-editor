import {
  KeyboardInteractionKeyPressEvent,
  KeyboardInteractionMediator,
} from '../mediators/keyboardInteractionMediator/KeyboardInteractionMediator';

export function subscribeToWindowKeyboardInteraction(keyboardInteractionMediator: KeyboardInteractionMediator) {
  window.addEventListener('keypress', (event) => {
    keyboardInteractionMediator.notify(new KeyboardInteractionKeyPressEvent(event.key));
  });
}
