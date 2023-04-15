import { ConstructorOf } from '../types';
import { Event, EventHandler } from './Event';
import { PubSub } from './PubSub';

export class EventBus extends PubSub<ConstructorOf<Event>, EventHandler, Event> {
  protected execute(event: Event, handler: EventHandler) {
    handler(event);
  }

  public publish(event: Event) {
    super.publish(event.constructor as ConstructorOf<Event>, event);
  }
}
