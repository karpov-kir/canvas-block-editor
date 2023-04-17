import { Command } from '../../utils/pubSub/Command';

export class Selection {
  #start: number;
  #end: number;

  public get start() {
    return this.#start;
  }

  public set start(start: number) {
    if (start < 0) {
      throw new RangeError('Selection start cannot be less than 0');
    }

    if (start >= this.end) {
      throw new RangeError('Selection start must be less than selection end');
    }

    this.#start = start;
  }

  public get end() {
    return this.#end;
  }

  public set end(end: number) {
    if (end <= this.start) {
      throw new RangeError('Selection end must be greater than selection start');
    }

    this.#end = end;
  }

  constructor(start: number, end: number) {
    this.#start = start;
    this.#end = end;
  }
}

export class SelectCommand extends Command {
  constructor(public readonly selection: Selection) {
    super();
  }
}
