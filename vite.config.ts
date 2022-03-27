import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'import',
            {
              libraryName: 'antd',
              libraryDirectory: 'es',
              style: 'css',
            },
          ],
        ],
      },
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
  resolve: {
    // 配置别名
    alias: {
      '~': path.resolve(__dirname, './'),
    },
  },
});
