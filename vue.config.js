const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, // 关闭eslint的检测，防止启动时老是报错
  devServer: {
    port: 8088, // 设置端口号
    proxy: {
      '/api': {
        target: `http://localhost:8888`, // 解决跨域问题
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
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
