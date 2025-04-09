// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const { type, keyword } = event;
    try {
        await db.collection('carAttributes').add({
            data: {
                type,
                keyword
            }
        });
        return { success: true };
    } catch (e) {
        console.error('添加关键字时出错：', e);
        return { success: false };
    }
};
    