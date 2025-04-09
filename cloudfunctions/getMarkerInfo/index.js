// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const { id } = event;
    try {
        const res = await db.collection('markers').doc(id).get();
        return {
            success: true,
            data: res.data
        };
    } catch (e) {
        console.error('获取数据失败', e);
        return {
            success: false,
            message: '获取数据失败'
        };
    }
};    