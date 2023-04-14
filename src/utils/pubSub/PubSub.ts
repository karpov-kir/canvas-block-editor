import { ConstructorOf } from '../types';

type Handler<Data> = (data: Data) => void;

export class PubSub<Channel, Data> {
  protected handlers: Map<Channel, Array<Handler<Data>>> = new Map();

  public subscribe(channel: Channel, handler: Handler<Data>) {
    const handlers = this.handlers.get(channel) || [];
    this.handlers.set(channel, [...handlers, handler]);
  }

  public publish(channel: Channel, data: Data) {
    const handlers = this.handlers.get(channel) || [];
    handlers.forEach((handler) => handler(data));
  }
}

export class ClassBasedPubSub<ClassConstructorChannel extends ConstructorOf<any>, Data> extends PubSub<
  ClassConstructorChannel,
  Data
> {
  public subscribe(ClassToSubscribe: ClassConstructorChannel, handler: Handler<Data>) {
    super.subscribe(ClassToSubscribe, handler);
  }

  public publish(instance: InstanceType<ClassConstructorChannel>) {
    super.publish(instance.constructor, instance);
  }
}
