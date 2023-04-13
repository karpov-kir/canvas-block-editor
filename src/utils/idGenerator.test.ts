import { createIdGenerator } from './idGenerator';

describe(createIdGenerator, () => {
  let firstIdGenerator: () => number;
  let secondIdGenerator: () => number;

  beforeEach(() => {
    firstIdGenerator = createIdGenerator();
    secondIdGenerator = createIdGenerator();
  });

  it('generates unique IDs withing a group in sequence', () => {
    const firstIdGroup = [firstIdGenerator(), firstIdGenerator()];
    const secondIdGroup = [secondIdGenerator()];

    secondIdGroup.push(secondIdGenerator());
    firstIdGroup.push(firstIdGenerator());

    expect(firstIdGroup).toEqual([1, 2, 3]);
    expect(secondIdGroup).toEqual([1, 2]);
  });
});
