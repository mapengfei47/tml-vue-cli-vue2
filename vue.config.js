const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development'; // 本地&编译判断标识，development｜production
const analyzer = (process.env.BUILD_ANALYZER || '').trim();
const speedMeasure = (process.env.SPEED_MEASURE || '').trim();
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');


const resolve = (dir) => path.join(__dirname, dir);
const OUTPUT_DIR = 'dist/';

const pages = resolvePages();
// 代理访问店铺
let cookie;
let target;
if (isDev) {
    let result = parseCookie();
    cookie = result.cookie;
    target = 'http://admin.inside.xiaoe-tech.com/';
}

const overallConfig = {
    outputDir: OUTPUT_DIR,
    productionSourceMap: false,
    indexPath: 'index.html',
    lintOnSave: false,
    pages,
    css: {
        extract: true, // 是否开启 CSS 抽离
        sourceMap: false // 是否为 CSS 开启 source map
    },
    devServer: {
        proxy: {
            //这里和.env中VUE_APP_BASE_URL对应，表示/p/t的页面链接不走代理，仅接口走代理，避免本地调试的时候走到现网
            '/xe.|/mp*|/xiaoe_app*': {
                target,
                changeOrigin: true,
                ws: false,
                onProxyReq(proxyReq) {
                    proxyReq.setHeader('cookie', cookie);
                    proxyReq.setHeader(
                        'x-forwarded-host',
                        target.includes('https://') ? target.substr('https://'.length) : target.substr('http://'.length)
                    );
                    proxyReq.setHeader('x-forwarded-port', target.includes('https://') ? '443' : '80');
                }
            }
        }
    },
    chainWebpack: (config) => {
        config.module
            .rule('images')
            .use('url-loader')
            .tap((options) => {
                // 图片小于10kb的配置，配置url-loader,打包进JS文件
                options.limit = 1024 * 10;
                return options;
            });

        // 别名
        config.resolve.alias.set('@', resolve('src'));
        config.resolve.alias.set('@views', resolve('src/views'));

        // 删除html模板
        if (!isDev) {
            Object.keys(pages).forEach((page) => {
                config.plugins.delete(`html-${page}`);
                config.plugins.delete(`preload-${page}`);
                config.plugins.delete(`prefetch-${page}`);
            });
        }

        // 查看打包加速
        if (speedMeasure) {
            const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
            config.plugin('speed-measure-webpack-plugin').use(SpeedMeasurePlugin).end();
        }
    },

    configureWebpack: {
        plugins: [
            //生成上报清单
            new WebpackManifestPlugin({
                fileName: '../upload.json',
                generate(seed, files, entries) {
                    const pages = Object.keys(entries).map((entry) => ({
                        page_name: entry,
                        page_path: entries[entry]
                    }));
                    return {
                        upload_dir: OUTPUT_DIR,
                        pages
                    };
                }
            })
        ]
    }
};

// 开启打包分析
if (analyzer) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    overallConfig.configureWebpack.plugins.push(new BundleAnalyzerPlugin());
}

if (!isDev) {
    overallConfig.configureWebpack.optimization = {
        splitChunks: {
            cacheGroups: {
                xiaoe: {
                    name: 'xiaoe-chunk',
                    test(module) {
                        let resName = module.resource;
                        return /[\\/]node_modules[\\/]/.test(resName) && resName.includes('@xiaoe');
                    },
                    priority: -8,
                    chunks: 'all'
                },
                vue: {
                    name: 'vue-vendors',
                    test(module) {
                        let resName = module.resource;
                        return /[\\/]node_modules[\\/]/.test(resName) && resName.includes('vue');
                    },
                    priority: -9,
                    chunks: 'initial'
                },
                vendors: {
                    name: 'chunk-vendors',
                    test(module) {
                        let resName = module.resource;
                        return /[\\/]node_modules[\\/]/.test(resName) && !resName.includes('@xiaoe');
                    },
                    priority: -10,
                    chunks: 'initial'
                }
            }
        }
    };
}
module.exports = overallConfig;

function resolvePages() {
    if (isDev) {
        return {
            index: 'src/main.js'
        };
    }

    // 多页时，开启这个
    // const pages = {};
    // fs.readdirSync(path.resolve(__dirname, 'src', 'views')).forEach(dir => {
    //     pages[dir] = {
    //         entry: `./src/views/${dir}/index.js`,
    //         template: 'public/index.html'
    //     };
    // });
    return {
        index: 'src/main.js'
    };
}

function parseCookie() {
    const COOKIE_PATH = 'cookie.txt';
    if (!fs.existsSync(COOKIE_PATH)) {
        console.warn('cookie.txt文件不存在');
        return {};
    }
    const content = fs.readFileSync(COOKIE_PATH).toString();

    const list = content.match(/(\w+)=(\w+)/g);
    const cookie = list.filter((item) => /pc_user_key|ko_token|b_user_token|with_app_id/.test(item)).join(';');

    let url;
    if (content.includes('sa_jssdk_2015_')) {
        url = content.match(/sa_jssdk_2015_(\w+)=/)[1].replace(/_/g, '.');
    } else {
        console.error('代理B端需要手动设置target');
    }

    return {
        cookie,
        target: url ? `https://${url}` : null
    };
}
