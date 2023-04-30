export function constrain(value: number, low: number, high: number) {
  return value > high ? high : value < low ? low : value;
}
