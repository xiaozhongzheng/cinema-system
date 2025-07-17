module.exports = {
  // 对于不想转化rem的可以使用大写的PX
  plugins: {
    'postcss-pxtorem': {
      rootValue: 10,
      propList: ['*'],               // 需要转换的属性，*表示全部
      // selectorBlackList: ['.no-rem'], // 不转换的选择器（添加.no-rem类名的元素不转换）
      minPixelValue: 12               // 小于12px不转换
    }
  }
}
