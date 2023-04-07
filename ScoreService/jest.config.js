module.exports = {
    testEnvironment: 'node', // default test environment is jsdom, so we need to change it to node
    testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'], // match files in __tests__ directories with .test.js or .test.ts extension
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1' // replace @ with src directory
    },
    transform: {
        '^.+\\.tsx?$': 'ts-jest' // transform .ts and .tsx files with ts-jest
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'] // setup file to start Express server and create supertest agent
};
