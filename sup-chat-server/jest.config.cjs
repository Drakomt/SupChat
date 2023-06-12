module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/src/**/*.test.(ts|tsx)'],
    testPathIgnorePatterns:['<rootDir>/node_modules/', '<rootDir>/dist/'],
};