Page({
    data: {
        usedCars: [],
        notices: []
    },
    onLoad() {
        this.getUsedCars();
        this.getNotices();
    },
    getUsedCars() {
        wx.cloud.callFunction({
            name: 'getUsedCars',
            success: res => {
                this.setData({
                    usedCars: res.result
                });
            },
            fail: err => {
                console.error('获取二手车列表失败', err);
                wx.showModal({
                    title: '提示',
                    content: '获取二手车列表失败，请稍后重试。',
                    showCancel: false
                });
            }
        });
    },
    getNotices() {
        wx.cloud.callFunction({
            name: 'getNotices',
            success: res => {
                console.log('获取公告数据成功:', res.result);
                this.setData({
                    notices: res.result
                });
            },
            fail: err => {
                console.error('获取公告数据失败', err);
                wx.showModal({
                    title: '提示',
                    content: '获取公告数据失败，请稍后重试。',
                    showCancel: false
                });
            }
        });
    },
    goToUsedCarList() {
        wx.navigateTo({
            url: '/pages/usedCarList/usedCarList'
        });
    },
    goToUsedCarDetail(e) {
        const car = e.currentTarget.dataset.car;
        wx.navigateTo({
            url: `/pages/detail/detail?car=${JSON.stringify(car)}`
        });
    },
    goToGeneralPage() {
        wx.navigateTo({
            url: '/pages/general/general'
        });
    }
});    