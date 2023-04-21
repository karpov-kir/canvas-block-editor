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

interface HandlerPerChannel {
  [key: string]: (data: any) => void;
}

type HandlerData<T extends HandlerPerChannel, C extends keyof T> = Parameters<T[C]>[0];
type Handler<T extends HandlerPerChannel, C extends keyof T> = (data: HandlerData<T, C>) => void;

export class MultiChannelPubSub<T extends HandlerPerChannel> extends PubSub<
  keyof T,
  Handler<T, keyof T>,
  HandlerData<T, keyof T>
> {
  protected execute(data: HandlerData<T, keyof T>, handler: Handler<T, keyof T>) {
    handler(data);
  }

  public subscribe<C extends keyof T>(channel: C, handler: Handler<T, C>) {
    super.subscribe(channel, handler);
  }

  public publish<C extends keyof T>(channel: C, data: HandlerData<T, C>) {
    super.publish(channel, data);
  }
}
