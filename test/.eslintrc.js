// Lint settings to support 'async' and 'await' for AVA tests

module.exports = {
  parserOptions: {
    ecmaVersion: 2017,
  },
  rules: {
    'space-before-function-paren': ['error', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'always',
    }],
  },
};
