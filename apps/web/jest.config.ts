import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  displayName: '@nx-monorepo/web',
  preset: '../../jest.preset.js',
  testMatch: [
    '<rootDir>/specs/**/*.(spec|test).[jt]s?(x)',
    '<rootDir>/src/**/*.(spec|test).[jt]s?(x)',
  ],
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/web',
  testEnvironment: 'jsdom',
  forceExit: false,
};

export default createJestConfig(config);
