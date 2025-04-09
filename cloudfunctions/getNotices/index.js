// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        const res = await db.collection('carAttributes').where({
            type: 'announcement'
        }).get();
        console.log('查询到的公告数据:', res.data); // 添加日志输出
        const notices = res.data.map(item => item.content);
        console.log('处理后的公告数据:', notices); // 添加日志输出
        return notices;
    } catch (e) {
        console.error('获取公告数据时出错：', e);
        return [];
    }
};