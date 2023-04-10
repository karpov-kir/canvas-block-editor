import { Options } from 'esbuild-jest';
import { Config } from 'jest';

const esbuildOptions: Options = {
  sourcemap: true,
};

export default async (): Promise<Config> => ({
  transform: {
    '^.+\\.tsx?$': ['esbuild-jest', esbuildOptions as Record<string, unknown>],
  },
  testRegex: './src/.*\\.(test|spec)?\\.ts$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',
});
