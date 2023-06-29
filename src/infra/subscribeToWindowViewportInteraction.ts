import {
  ViewportInteractionMediator,
  ViewportInteractionResizeEvent,
} from '../mediators/viewportInteractionMediator/ViewportInteractionMediator';
import { Dimensions } from '../utils/math/Dimensions';

export function subscribeToWindowViewportInteraction(viewportInteractionMediator: ViewportInteractionMediator) {
  window.addEventListener('resize', () => {
    viewportInteractionMediator.notify(
      new ViewportInteractionResizeEvent(new Dimensions(window.innerWidth, window.innerHeight)),
    );
  });
}
