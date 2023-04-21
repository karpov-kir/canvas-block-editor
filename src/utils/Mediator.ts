export interface MediatorEvent {
  readonly type: string;
}
export interface Mediator<T extends MediatorEvent> {
  notify(event: T): void;
}
