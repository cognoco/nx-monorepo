const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  // Load environment variables before each test file
  // This ensures DATABASE_URL and other env vars are available in tests
  setupFiles: ['<rootDir>/jest.setup.js'],
};
