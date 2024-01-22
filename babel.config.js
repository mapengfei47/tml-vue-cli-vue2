module.exports = {
    presets: ['@vue/cli-plugin-babel/preset'],
    plugins: [
        // 组件按需插件配置
        [
            'component',
            {
                libraryName: '@xiaoe/js-tools',
                style: false
            },
            '@xiaoe/js-tools'
        ],
        [
            'component',
            {
                libraryName: '@xiaoe/sense',
                style: true
            },
            '@xiaoe/sense'
        ]
    ]
};
