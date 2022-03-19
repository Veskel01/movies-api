module.exports = {
  diff: true, // show diff on failure
  extension: ['ts', 'json'],
  package: './package.json',
  reporter: 'spec',
  spec: './__tests__/**/*.ts',
  slow: '75',
  timeout: '2000',
  ui: 'bdd',
  'fail-zero': true,
  'watch-files': ['./__tests__/**/*.ts'],
  'watch-ignore': [
    './dist/**/*',
    'node_modules',
    './__tests__/unit/*.js',
    './__tests__/integration/*.js',
    './__tests__/e2e/*.js',
    './__tests__/setup.ts',
    './__tests__/fixtures/*',
  ],
  // file: ['./__tests__/setup.ts'],
  // ignore: ['./__tests__/setup.ts'],
  require: ['ts-node/register'],
};
