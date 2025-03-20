const { defineConfig } = require('@vue/cli-service')
const path = require('path');
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, // 关闭eslint的检测，防止启动时老是报错
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // 确保 @ 指向 src 目录
      },
    },
  },
  devServer: {
    port: 8088, // 设置端口号
    proxy: {
      '/api': {
        target: `http://localhost:8888`, // 解决跨域问题
        changeOrigin: true,
        pathRewrite: {
          '^/api': '' // 重定向
        }
      }
    },
    client: { // 使页面不出现全屏报错
      overlay: false
    }

  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: [["@babel/plugin-transform-runtime"]],
            },
          },
        },
      ]
    }
  }
})
