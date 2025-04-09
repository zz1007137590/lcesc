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
            })
        }).catch(err =>{
            console.log('获取失败',err)
        })
    }
});
