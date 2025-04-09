// 云函数入口文件
const cloud = require('wx-server-sdk')
const https = require('https');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const { url, data } = event;

    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(url + '?' + new URLSearchParams(data), options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    resolve(response);
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
};    