Page({
    getPhoneNumber(e){
        console.log('wx.cloud:', wx.cloud); // 添加调试日志
        console.log('点击按钮获取的开发数据',e);
        wx.cloud.callFunction({
            name:'getPhone',
            data:{
                cloudID: e.detail.cloudID
            }
        }).then(res =>{
            console.log('获取成功',res.result.list[0].data.phoneNumber)
            this.setData({
                phone:'获取到的手机号码：'+res.result.list[0].data.phoneNumber
            });

            // 调用云函数保存用户信息到数据库
            wx.cloud.callFunction({
                name: 'saveUserInfo',
                data: {
                    phoneNumber: res.result.list[0].data.phoneNumber
                }
            }).then(saveRes => {
                console.log('用户信息保存成功', saveRes);
            }).catch(saveErr => {
                console.log('用户信息保存失败', saveErr);
            });
        }).catch(err => {
            console.log('获取失败', err);
        });
    }
});
