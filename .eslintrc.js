module.exports = {
  env: {
    node: true,
  },
  extends: ['airbnb-base'],

  rules: {
    // your rules
    'no-shadow': 'off',
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
    'consistent-return': 'off',
    'import/no-dynamic-require': 'off',
    'global-require': 'off',
    'max-len': ['error', { code: 120 }],
    // 'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
