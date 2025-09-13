module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/spec/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: '.',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  }
};
