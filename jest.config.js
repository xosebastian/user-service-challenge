module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/src/**/*.ts',
    '!**/src/main.ts',
    '!**/src/app.module.ts',
    '!**/src/config/**',
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^@users/(.*)$': '<rootDir>/src/users/$1',
    '^@users/domain/(.*)$': '<rootDir>/src/users/domain/$1',
    '^@users/application/(.*)$': '<rootDir>/src/users/application/$1',
    '^@users/infrastructure/(.*)$': '<rootDir>/src/users/infrastructure/$1',
    '^@users/application/commands/(.*)$': '<rootDir>/src/users/application/commands/$1',
    '^@users/application/queries/(.*)$': '<rootDir>/src/users/application/queries/$1',
    '^@users/infrastructure/controllers/(.*)$': '<rootDir>/src/users/infrastructure/controllers/$1',
    '^@users/infrastructure/persistence/(.*)$': '<rootDir>/src/users/infrastructure/persistence/$1',
    '^@users/module$': '<rootDir>/src/users/users.module',
    '^@configuration/(.*)$': '<rootDir>/src/configuration/$1',
  },
};
