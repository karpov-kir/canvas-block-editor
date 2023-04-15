export abstract class PubSub<Channel, Handler, Data> {
  protected handlers: Map<Channel, Array<Handler>> = new Map();

  protected abstract execute(data: Data, handler: Handler): void;

  public subscribe(channel: Channel, handler: Handler) {
    const handlers = this.handlers.get(channel) || [];
    this.handlers.set(channel, [...handlers, handler]);
  }

  public publish(channel: Channel, data: Data) {
    const handlers = this.handlers.get(channel) || [];
    handlers.forEach((handler) => this.execute(data, handler));
  }
}
