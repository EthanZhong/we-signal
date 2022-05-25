/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
import type { Config } from '@jest/types';
import { defaults as tsjPreset } from 'ts-jest/presets';

export default {
  verbose: true,
  coverageProvider: 'v8',
  collectCoverageFrom: ['./src/**/*.ts'],
  coverageDirectory: 'coverage',
  extensionsToTreatAsEsm: ['.ts'],
  injectGlobals: false,
  preset: 'ts-jest',
  transform: {
    ...tsjPreset.transform
  },
} as Config.InitialOptions;
