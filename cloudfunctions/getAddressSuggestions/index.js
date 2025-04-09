// 云函数入口文件
const cloud = require('wx-server-sdk')
const CryptoJS = require('crypto-js');

cloud.init()

// 替换为你的腾讯地图 API Key 和 Secret Key
const TENCENT_MAP_API_KEY = '6KJBZ-5PSKQ-FCA5X-2JXEN-4RDOS-2MBDU';
const TENCENT_MAP_SECRET_KEY = 'jpZ5GUhTXlJk8UCNgwsuTRLAK2QGt80G';

// 云函数入口函数
exports.main = async (event, context) => {
    const { keyword, location } = event;

    try {
        // 构建请求参数
        const params = {
            keyword,
            location,
            key: TENCENT_MAP_API_KEY,
            region: '全国',
            policy: 1
        };

        // 对参数进行排序
        const sortedParams = Object.keys(params).sort().reduce((acc, key) => {
            acc[key] = params[key];
            return acc;
        }, {});

        // 拼接参数字符串
        const paramString = Object.entries(sortedParams).map(([key, value]) => `${key}=${value}`).join('&');

        // 生成签名
        const signature = CryptoJS.HmacSHA256(paramString, TENCENT_MAP_SECRET_KEY).toString(CryptoJS.enc.Hex);

        // 将签名添加到请求参数中
        params.sig = signature;

        const res = await cloud.callFunction({
            name: 'request',
            data: {
                url: 'https://apis.map.qq.com/ws/place/v1/suggestion',
                data: params
            }
        });

        return res.result;
    } catch (error) {
        console.error('获取地址联想建议失败', error);
        return {
            status: -1,
            message: '获取地址联想建议失败',
            error: error.message
        };
    }
};