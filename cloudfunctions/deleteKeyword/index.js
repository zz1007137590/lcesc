// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const { type, id } = event;
    try {
        await db.collection('carAttributes').doc(id).remove();
        return { success: true };
    } catch (e) {
        console.error('删除关键字时出错：', e);
        return { success: false };
    }
};    