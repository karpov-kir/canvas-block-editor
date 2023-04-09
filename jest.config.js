export default {
  transform: {
    '^.+\\.tsx?$': 'esbuild-jest',
  },
  testRegex: './src/.*\\.(test|spec)?\\.ts$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',
};
