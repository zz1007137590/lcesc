// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        const res = await db.collection('usedCars').get();
        return res.data;
    } catch (e) {
        console.error('获取二手车列表时出错：', e);
        return [];
    }
};    