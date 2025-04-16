// lcesc/cloudfunctions/getYearRange/index.js
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
    try {
        const res = await db.collection('usedCars').field({ year: true }).get();
        const years = res.data.map(car => car.year);
        const minYear = Math.min(...years);
        const maxYear = Math.max(...years);
        return {
            minYear,
            maxYear
        };
    } catch (err) {
        console.error('获取年份范围失败', err);
        return {
            minYear: 0,
            maxYear: 0
        };
    }
};