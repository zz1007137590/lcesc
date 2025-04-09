// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const { id } = event;
    try {
        await db.collection('usedCars').doc(id).remove();
        return { success: true };
    } catch (e) {
        console.error('删除二手车时出错：', e);
        return { success: false };
    }
};    