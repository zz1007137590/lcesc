// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const { id, content } = event;
    try {
        await db.collection('announcements').doc(id).update({
            data: {
                content
            }
        });
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false };
    }
};
    