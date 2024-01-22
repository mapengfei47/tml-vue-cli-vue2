//开发、测试、现网环境动态public path，不要随意修改
if (process.env.NODE_ENV !== 'development') {
    // eslint-disable-next-line no-undef
    __webpack_public_path__ = `${window.__cdn_url_prefix}/`;
}
