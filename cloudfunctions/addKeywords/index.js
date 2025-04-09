// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const { type, keywords } = event;
    const collectionName = `${type}Keywords`;
    try {
        const batch = db.collection(collectionName).add();
        keywords.forEach(keyword => {
            batch.data({
                keyword
            });
        });
        await batch.commit();
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false };
    }
};
    