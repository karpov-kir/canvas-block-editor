export default {
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testRegex: './src/.*\\.(test|spec)?\\.ts$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',
};
