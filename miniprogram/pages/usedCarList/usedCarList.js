Page({
    data: {
        usedCars: []
    },
    onLoad() {
        this.getUsedCars();
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
    editUsedCar(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/editUsedCar/editUsedCar?id=${id}`
        });
    },
    deleteUsedCar(e) {
        const id = e.currentTarget.dataset.id;
        wx.showModal({
            title: '确认删除',
            content: '确定要删除这辆二手车吗？',
            success: res => {
                if (res.confirm) {
                    wx.cloud.callFunction({
                        name: 'deleteUsedCar',
                        data: {
                            id
                        },
                        success: () => {
                            wx.showToast({
                                title: '删除成功',
                                icon: 'success'
                            });
                            this.getUsedCars();
                        },
                        fail: err => {
                            console.error('删除二手车失败', err);
                            wx.showModal({
                                title: '提示',
                                content: '删除二手车失败，请稍后重试。',
                                showCancel: false
                            });
                        }
                    });
                }
            }
        });
    },
    goToAddUsedCar() {
        wx.navigateTo({
            url: '/pages/addUsedCar/addUsedCar'
        });
    }
});    