/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/src/test/tsconfig.json',
        diagnostics: {
          ignoreCodes: ['TS151001'],
        },
      },
    ],
  },
};
