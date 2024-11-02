const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, // 关闭eslint的检测，防止启动时老是报错
  devServer: {
    port: 8088,
    proxy: {
      '/api': {
        target: `http://localhost:8080`,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
})
