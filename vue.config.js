const { defineConfig } = require('@vue/cli-service')
const path = require('path');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, // 关闭eslint的检测，防止启动时老是报错
  devServer: {
    port: 8088, // 设置端口号
    proxy: {
      '/api': {
        // target: `http://localhost:8080`, // 代理到本地
        target: `http://106.52.252.158:8080`, // 代理到服务器
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
  configureWebpack: { // webpack的配置
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // 确保 @ 指向 src 目录
      },
    },
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
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          type: 'asset/resource'
        }
      ]
    },
    devtool: "cheap-module-source-map",
    optimization: {
      minimizer: [
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.imageminMinify,
            options: {
              plugins: [
                ['jpegtran', { progressive: true }],
                ['optipng', { optimizationLevel: 5 }],
                // JPEG无损压缩
                ['mozjpeg', { quality: 90, progressive: true }],
                // PNG无损压缩
                ['pngquant', { quality: [0.8, 0.9], speed: 4 }],
                // GIF无损压缩
                ['gifsicle', { interlaced: true, optimizationLevel: 3 }],
                [
                  'svgo',
                  {
                    plugins: [
                      {
                        name: 'preset-default',
                        params: {
                          overrides: {
                            removeViewBox: false,
                            addAttributesToSVGElement: {
                              params: {
                                attributes: [
                                  { xmlns: 'http://www.w3.org/2000/svg' }
                                ]
                              }
                            }
                          }
                        }
                      }
                    ]
                  }
                ]
              ]
            }
          }
        })
      ]
    }

  }
})
