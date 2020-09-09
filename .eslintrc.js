//.eslintrc.js
module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true
  },
  parserOptions: {
      parser: 'babel-eslint'
  },
  extends: [// https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/strongly-recommended',
    // 推荐使用这个插件，作为vue/essential的补充
    'standard'
  ],
  // required to lint *.vue files
  plugins: ['vue'],
  // add your custom rules here
  rules: {
    "no-debugger": 0,//禁止使用debugger
    // 缩进规则，根据项目开发人员习惯进行配置 默认不限制
    "indent": [
      "error",
      2,
      {
        "SwitchCase": 1
      }
    ],
    "vue/html-indent": [
      "error",
      2,
      {
        "attribute": 1,
        "closeBracket": 0,
        "alignAttributesVertically": true
      }
    ],
    'no-tabs': 0,
    'no-debugger': 0
  }
}
