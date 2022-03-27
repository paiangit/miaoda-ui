# 创建

```sh
pnpm create vite miaodaui
cd miaodaui
pnpm config set registry http://registry.npm.taobao.org
pnpm i
pnpm dev
```

# 引入antd

安装依赖：

```sh
pnpm add antd
pnpm add less babel-plugin-import -D
```

配置：

```tsx
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'import',
            {
              "libraryName": "antd",
              "libraryDirectory": "es",
              "style": true
            }
          ],
        ],
      }
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
        // 重写 less 变量，定制样式
        modifyVars: {
          '@primary-color': 'red',
        },
      },
    },
  },
});
```

导入样式：

```tsx
// App.tsx

import 'antd/dist/antd.less'
```

# 添加.editorconfig
```
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
trim_trailing_whitespace = true
insert_final_newline = false

[*.md]
trim_trailing_whitespace = false
.
```

# 配置系列格式化和校验工具：husky + lint-staged + stylelint + eslint + prettier + commitlint + VS Code settings

## husky

为了能够在 git commit 之前自动执行一些格式化和校验的动作，需要用到 git hooks，比如，在 pre-commit 这个 git hook 里面去执行 prettier 格式化的动作。为了完成这一点，要用到两个 npm 包：husky 和 lint-staged。

husky 是一个方便的 git hook 助手；

lint-staged 是一个只对 git 暂存文件运行 linters 检查的工具（用它可以避免每次修改一个文件就给所有文件执行一次 lint 检查）。

```sh
pnpm add husky -D
```

## stylelint

```
pnpm add stylelint stylelint-config-standard postcss-less -D
```

添加.stylelintrc.js

```js
module.exports = {
  // 默认规则列表：https://stylelint.io/user-guide/rules/list/
  // 插件列表：https://github.com/stylelint/awesome-stylelint#plugins
  "extends": ["stylelint-config-standard"],
  rules: {
    "selector-pseudo-class-no-unknown": [
      true,
      {
        // 允许:global正常使用
        "ignorePseudoClasses": ["global"]
      }
    ],
  },
}
```

添加.stylelintignore
```
#stylelint自动忽略node_modules和bower_modules
*.js
*.png
*.eot
*.ttf
*.woff
```

修改package.json：

```json
"lint-staged": {
  "*.css": [
    "stylelint --fix --cache"
  ],
  "*.less": [
    "stylelint --fix --cache --custom-syntax postcss-less"
  ]
},
```

## eslint

```sh
pnpm add eslint eslint-config-react-app eslint-config-prettier -D
npx eslint --init
```

.eslintrc.js

```js
module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    'react-app',
    // "eslint:recommended",
    // "plugin:react/recommended",
    // "plugin:@typescript-eslint/recommended",
    // 关闭所有不必要或可能与Prettier冲突的规则
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "@typescript-eslint"
  ],
  "rules": {
  }
}
```

修改package.json

```json
"lint-staged": {
  "*.css": [
    "stylelint --fix --cache"
  ],
  "*.less": [
    "stylelint --fix --cache --custom-syntax postcss-less"
  ],
  "*.{tsx,ts,js}": [
    "eslint --fix --cache"
  ]
},
```

## prettier

```sh
pnpm add prettier -D # 需要先安装prettier再执行下面这条命令，否则安装不成功：Cannot add lint-staged
npx mrm@2 lint-staged
```

添加.prettierignore

```sh
build
coverage
```

添加.prettierrc.js

```js
module.exports = {
  singleQuote: true,
  // 一行最多 80 字符
  printWidth: 80,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 不使用缩进符，而使用空格
  useTabs: false,
  // 行尾需要有分号
  semi: true,
  // 使用单引号
  singleQuote: true,
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: false,
  // 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
  trailingComma: 'es5',
  // 大括号内的首尾需要空格
  bracketSpacing: true,
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: true,
  // 箭头函数，只有一个参数的时候，也需要括号
  arrowParens: 'avoid',
  // 每个文件格式化的范围是文件的全部内容
  // rangeStart: 0
};
```

package.json中添加：

```json
"lint-staged": {
  "*.css": [
    "stylelint --fix --cache"
  ],
  "*.less": [
    "stylelint --fix --cache --custom-syntax postcss-less"
  ],
  "*.{tsx,ts,js}": [
    "eslint --fix --cache",
    "prettier --write"
  ]
},
```

## commitlint

```sh
pnpm add commitlint @commitlint/config-conventional -D
```

commitlint.config.js

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 允许的type类型，第一个参数的含义：0-禁止、1-警告、2-错误
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'revert', 'build', 'chore', 'ci', 'perf'],
    ],
    // type需小写
    'type-case': [2, 'always', 'lowerCase'],
    // type不能为空
    'type-empty': [2, 'never'],
    // subject不能以'.'结尾
    'subject-full-stop': [2, 'never', '.'],
  },
};
```

添加.husky/commit-msg：

```
#!/bin/sh

npx --no -- commitlint --edit $1
```

## vscode settings

.vscode/settings.json

```
{
  "editor.codeActionsOnSave": {
    // 保存时stylelint插件自动修正样式格式
    "source.fixAll.stylelint": true,
    // 保存时eslint插件自动修正JS/TS等
    "source.fixAll.eslint": true
  },
  // 保存时自动格式化
  "editor.formatOnSave": true,
  // 粘贴时自动格式化
  "editor.formatOnPaste": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```
