// lcesc/cloudfunctions/addUsedCar/index.js
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
    try {
        await db.collection('usedCars').add({
            data: {
                mainImage: event.mainImage,
                detailImages: event.detailImages,
                title: event.title,
                price: event.price,
                cost: event.cost,
                brand: event.brand,
                gear: event.gear,
                model: event.model,
                mileage: event.mileage,
                displacement: event.displacement,
                year: event.year // 新增年份数据
            }
        })
        return {
            success: true,
            message: '新增二手车成功'
        }
    } catch (err) {
        console.error('新增二手车失败', err)
        return {
            success: false,
            message: '新增二手车失败，请稍后重试'
        }
    }
}