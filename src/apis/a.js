// a 模块请求

import { request } from '@xiaoe/js-tools';

export function getInfo(params) {
    return request({
        url: 'xxxx.xxxx.info',
        params
    });
}
