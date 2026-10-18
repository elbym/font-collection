const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  { ignores: ['_site/**', '_site.baseline/**', 'node_modules/**', 'src/webfonts/**', 'dist/**', 'src/force-graph.min.js'] },
  js.configs.recommended,
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs', globals: globals.node } },
  { files: ['src/assets/js/**/*.js'], languageOptions: { sourceType: 'module', globals: globals.browser } },
];
