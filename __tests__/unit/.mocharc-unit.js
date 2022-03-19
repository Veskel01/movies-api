const globalConfig = require('../../.mocharc');
module.exports = {
  ...globalConfig,
  spec: './__tests__/unit/**/*.spec.ts',
  ui: 'bdd',
  'watch-files': ['./__tests__/unit/**/*.spec.ts'],
};
