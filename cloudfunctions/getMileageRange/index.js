// lcesc/cloudfunctions/getMileageRange/index.js
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
    try {
        const res = await db.collection('usedCars').field({ mileage: true }).get();
        const mileages = res.data.map(car => car.mileage);
        const maxMileage = Math.max(...mileages);
        return {
            maxMileage
        };
    } catch (err) {
        console.error('获取公里数范围失败', err);
        return {
            maxMileage: 0
        };
    }
};