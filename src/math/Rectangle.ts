import { Dimensions } from './Dimensions';
import { Vector } from './Vector';

export class Rectangle {
  constructor(public position: Vector = new Vector(), public dimensions = new Dimensions()) {}
}
