export abstract class Builder<T> {
  public abstract get instance(): T;
  public abstract set instance(instance: T);

  public abstract createEmpty(): T;

  public reset() {
    this.instance = this.createEmpty();
    return this;
  }

  public buildAndReset() {
    const instance = this.instance;
    this.reset();
    return instance;
  }
}
