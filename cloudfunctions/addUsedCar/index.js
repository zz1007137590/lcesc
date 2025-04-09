// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const { mainImage, detailImages, title, price, cost, brand, gear, model, mileage, displacement } = event;
    try {
        await db.collection('usedCars').add({
            data: {
                mainImage,
                detailImages,
                title,
                price,
                cost,
                brand,
                gear,
                model,
                mileage,
                displacement
            }
        });
        return { success: true };
    } catch (e) {
        console.error('添加二手车信息时出错：', e);
        return { success: false };
    }
};    