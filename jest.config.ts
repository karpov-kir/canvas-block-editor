import { Config } from 'jest';

export default async (): Promise<Config> => ({
  transform: {
    '^.+\\.tsx?$': '@swc/jest',
  },
  testRegex: './src/.*\\.(test|spec)?\\.ts$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',
});
