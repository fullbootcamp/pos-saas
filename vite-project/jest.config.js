module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Correct path to /vite-react/jest.setup.js
    transform: {
      '^.+\\.tsx?$': 'ts-jest', // Handles .ts and .tsx files
    },
    roots: ['<rootDir>/src'], // Points to /vite-react/src
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'], // Matches .ts and .tsx test files
    globals: {
      'ts-jest': {
        tsconfig: '<rootDir>/tsconfig.json',
        diagnostics: false,
      },
    },
  };