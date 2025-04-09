// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const phoneNumber = event.phoneNumber;
  const now = new Date();

  try {
    // 检查用户是否已经存在
    const user = await db.collection('users').where({
      _openid: openid
    }).get();

    if (user.data.length === 0) {
      // 用户首次注册
      await db.collection('users').add({
        data: {
          _openid: openid,
          phoneNumber: phoneNumber,
          firstRegisterTime: now,
          lastLoginTimes: [now],
          userRole: '普通用户'
        }
      });
    } else {
      // 用户已经存在，更新登录时间
      let lastLoginTimes = user.data[0].lastLoginTimes || [];
      lastLoginTimes.unshift(now);
      if (lastLoginTimes.length > 3) {
        lastLoginTimes = lastLoginTimes.slice(0, 3);
      }
      await db.collection('users').where({
        _openid: openid
      }).update({
        data: {
          phoneNumber: phoneNumber,
          lastLoginTimes: lastLoginTimes
        }
      });
    }

    return {
      success: true,
      message: '用户信息保存成功'
    };
  } catch (err) {
    console.error('保存用户信息失败', err);
    return {
      success: false,
      message: '保存用户信息失败',
      error: err
    };
  }
};