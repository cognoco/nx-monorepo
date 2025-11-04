const nxPreset = require('@nx/jest/preset').default;
const { join } = require('path');

module.exports = {
  ...nxPreset,
  // Load environment variables before each test file
  // This ensures DATABASE_URL and other env vars are available in tests
  // Note: Points to workspace root's jest.setup.js, not project-specific file
  setupFiles: [join(__dirname, 'jest.setup.js')],
};
