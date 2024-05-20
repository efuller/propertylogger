import { Config } from 'jest';

export default async (): Promise<Config> => ({
  verbose: true,
  maxWorkers: 1,
  testTimeout: 30000,
  projects: [
    {
      displayName: 'api-unit',
      testMatch: ['**/@(src|tests)/**/*.@(test|spec).@(ts|tsx)'],
      transform: {
        '^.+\\.tsx?$': ['ts-jest', {}],
      },
      rootDir: '<rootDir>/packages/api'
    },
    {
      displayName: 'api-e2e',
      testMatch: ['**/@(src|tests)/**/*.@(e2e).@(ts|tsx)'],
      transform: {
        '^.+\\.tsx?$': ['ts-jest', {}],
      },
      globalSetup: './tests/setupLocalTestingEnv.ts',
      rootDir: '<rootDir>/packages/api'
    },
    {
      displayName: 'api-infra',
      testMatch: ['**/@(src|tests)/**/*.@(infra).@(ts|tsx)'],
      transform: {
        '^.+\\.tsx?$': ['ts-jest', {}],
      },
      rootDir: '<rootDir>/packages/api',
      globalSetup: './tests/setupLocalTestingEnv.ts',
    },
    {
      displayName: 'api-staging-e2e',
      testMatch: ['**/@(src|tests)/**/*.@(e2e).@(ts|tsx)'],
      transform: {
        '^.+\\.tsx?$': ['ts-jest', {}],
      },
      rootDir: '<rootDir>/packages/api',
      globalSetup: './tests/setupStagingTestingEnv.ts',
    },
    {
      displayName: 'api-staging-infra',
      testMatch: ['**/@(src|tests)/**/*.@(infra).@(ts|tsx)'],
      transform: {
        '^.+\\.tsx?$': ['ts-jest', {}],
      },
      rootDir: '<rootDir>/packages/api',
      globalSetup: './tests/setupStagingTestingEnv.ts',
    },
    {
      displayName: 'web-e2e',
      preset: "jest-puppeteer",
      testMatch: ['**/@(src|tests)/**/*.@(e2e).@(ts|tsx)'],
      transform: {
        '^.+\\.tsx?$': ['ts-jest', {}],
      },
      rootDir: '<rootDir>/packages/web'
    },
    {
      displayName: 'web-infra',
      preset: "ts-jest",
      testMatch: ['**/@(src|tests)/**/*.@(infra).@(ts|tsx)'],
      transform: {
        '^.+\\.tsx?$': ['ts-jest', {}],
      },
      transformIgnorePatterns: [
        __dirname + '/node_modules/(?!uuid).+\\.js$'
      ],
      moduleNameMapper: {
        '^jose$': __dirname + '/node_modules/jose/dist/node/cjs',
        "^uuid$": require.resolve('uuid')
      },
      testEnvironment: "jsdom",
      rootDir: '<rootDir>/packages/web',
    },
    {
      displayName: 'web',
      preset: "ts-jest",
      testEnvironment: "jsdom",
      testMatch: ['**/@(src|tests)/**/*.@(spec|test).@(ts|tsx)'],
      transform: {
        '^.+\\.tsx?$': ['ts-jest', {}],
      },
      moduleNameMapper: {
        '^jose$': __dirname + '/node_modules/jose/dist/node/cjs',
      },
      rootDir: '<rootDir>/packages/web'
    },
  ]
})