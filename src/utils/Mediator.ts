export interface Mediator<T> {
  notify(event: T): void;
}
