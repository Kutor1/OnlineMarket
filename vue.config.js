const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // 使用相对路径打包
  publicPath: './',
  transpileDependencies: true
})
