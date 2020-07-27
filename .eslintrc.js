module.exports = {
  ignorePatterns: ["node_modules/"],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'linebreak-style': ['error', 'unix'],
    'no-trailing-spaces': "off",
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true}],
  },

  root: true,

  env: {
    node: true
  },

  extends: [
    "airbnb-base",
    'plugin:vue/vue3-recommended'
  ],

  parserOptions: {
    ecmaVersion: 2020
  }
}
