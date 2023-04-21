import { Dimensions } from '../../utils/math/Dimensions';
import { ViewportInteractionMediator, ViewportInteractionResizeEvent } from './ViewportInteractionMediator';

export function subscribeToViewportInteraction(viewportInteractionMediator: ViewportInteractionMediator) {
  window.addEventListener('resize', () => {
    viewportInteractionMediator.notify(
      new ViewportInteractionResizeEvent(new Dimensions(window.innerWidth, window.innerHeight)),
    );
  });
}
