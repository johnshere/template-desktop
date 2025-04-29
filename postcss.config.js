// eslint-disable-next-line no-undef
module.exports = {
    plugins: {
        // postcss-pxtorem 插件的版本需要 >= 5.0.0
        'postcss-pxtorem': {
            rootValue: 100,
            propList: ['*']
            // exclude: function (file) {
            //     // 指定px转rem的页面
            //     return !file.includes('analysis-base')
            // }
        }
    }
}
