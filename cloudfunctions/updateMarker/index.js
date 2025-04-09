// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const { id, frontPhoto, detailPhotos, shopName, contactName, phoneNumber, address } = event;
    try {
        await db.collection('markers').doc(id).update({
            data: {
                frontPhoto,
                detailPhotos,
                shopName,
                contactName,
                phoneNumber,
                address
            }
        });
        return {
            success: true,
            message: '数据修改成功'
        };
    } catch (e) {
        console.error('修改数据失败', e);
        return {
            success: false,
            message: '数据修改失败'
        };
    }
};    