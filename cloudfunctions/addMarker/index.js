// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { frontPhoto, detailPhotos, shopName, contactName, phoneNumber, address, longitude, latitude } = event
  try {
    await db.collection('markers').add({
      data: {
        frontPhoto,
        detailPhotos,
        shopName,
        contactName,
        phoneNumber,
        address,
        longitude,
        latitude
      }
    })
    return {
      success: true,
      message: '数据提交成功'
    }
  } catch (e) {
    console.error('提交失败', e)
    return {
      success: false,
      message: `数据提交失败: ${e.message}`
    }
  }
}  