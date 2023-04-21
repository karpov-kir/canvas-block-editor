import { KeyboardInteractionKeyPressEvent, KeyboardInteractionMediator } from './KeyboardInteractionMediator';

export function subscribeToKeyboardInteraction(keyboardInteractionMediator: KeyboardInteractionMediator) {
  window.addEventListener('keypress', (event) => {
    keyboardInteractionMediator.notify(new KeyboardInteractionKeyPressEvent(event.key));
  });
}
