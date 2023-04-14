export class Event {}

export abstract class EventHandler {
  public abstract handle(event: Event): void;
}
