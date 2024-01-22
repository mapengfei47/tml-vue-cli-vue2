/* 
 动态修改publicPath地址
 原理：用占位符替换 把原来publicPath配置里的占位符字符串[window.__app_id]替换成表达式 "+window.__app_id
__webpack_require__.p = "https://assets-inside.cdn.xiaoeknow.com//account-platform/h5_user_account_fe/"+window.TAGNAME+"/";
*/
class publicPathPlugin {
    constructor(options) {
        //这里先不用，后续可以用上插件参数配置
        this.options = options;
    }
    apply(compiler) {
        // compiler.hooks钩子处理，一次编译模块执行完后，异步做处理
        compiler.hooks.afterCompile.tapAsync('greyPlugin', (compilation, cb) => {
            //  compilation 本次编译的数据，compilation.chunks 是打包出来的chunk集合
            let chunks = compilation.chunks;
            let reg = /\.js$/;
            chunks.forEach((chunk) => {
                chunk.files.forEach((filename) => {
                    if (reg.test(filename)) {
                        let oldValue = compilation.assets[filename].source();
                        if (oldValue) {
                            console.log(typeof oldValue);
                            let newValue = oldValue.replace(/\[window.__cdn_url_prefix\]\/\"/g, `"+window.__cdn_url_prefix+"/"`);
                            newValue = oldValue.replace(/\[window.__cdn_url_prefix\]\//g, `"+window.__cdn_url_prefix+"/`);
                            compilation.assets[filename] = {
                                source() {
                                    return newValue;
                                },
                                size() {
                                    return newValue.length;
                                }
                            };
                        }
                    }
                });
            });
            // 异步处理执行回调
            cb();
        });
    }
}

module.exports = publicPathPlugin;
