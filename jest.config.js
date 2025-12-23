module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'services/**/*.js',
    'auth/**/*.js',
    'routers/**/*.js'
  ],
  coverageDirectory: 'coverage',
  verbose: true
};
