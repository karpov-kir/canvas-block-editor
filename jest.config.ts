import { Config } from 'jest';

export default async (): Promise<Config> => ({
  collectCoverage: true,
  transform: {
    '^.+\\.tsx?$': '@swc/jest',
  },
  testRegex: './src/.*\\.(test|spec)?\\.ts$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',
  testResultsProcessor: 'jest-sonar-reporter',
  verbose: true,
  coverageDirectory: './coverage',
});
