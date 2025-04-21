import type { Config } from 'jest';
import { createCjsPreset } from 'jest-preset-angular/presets';
;

export default {
    ...createCjsPreset(),
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',     // → resolve import urlConfig from 'src/app/config/...'
      },
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    transformIgnorePatterns: ['<rootDir>/node_modules/(?!(@ionic/core|@ionic/angular|@stencil/core|.*\\.mjs$))']
} satisfies Config;