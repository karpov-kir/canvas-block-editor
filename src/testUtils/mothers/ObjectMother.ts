import { Builder } from './Builder';

type GetBuilderInstanceType<T extends Builder<any>> = T extends Builder<infer U> ? U : never;

export abstract class ObjectMother<T extends Builder<any>> {
  protected readonly history: GetBuilderInstanceType<T>[] = [];

  public abstract readonly builder: T;

  public get last(): GetBuilderInstanceType<T> {
    return this.history[this.history.length - 1];
  }

  public get lastTwo() {
    return this.history.slice(-2);
  }

  public get lastThree() {
    return this.history.slice(-3);
  }

  public setCustom(setter: (builder: T) => void) {
    setter(this.builder);
    return this;
  }

  public create() {
    this.history.push(this.builder.create());
    return this.last;
  }
}
