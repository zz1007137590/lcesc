// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const { id } = event
    try {
        const res = await db.collection('markers').doc(id).remove()
        if (res.stats.removed === 1) {
            return {
                success: true,
                message: '标注点删除成功'
            }
        } else {
            return {
                success: false,
                message: '未找到对应标注点，删除失败'
            }
        }
    } catch (e) {
        console.error('删除失败', e)
        return {
            success: false,
            message: `删除失败: ${e.message}`
        }
    }
}    