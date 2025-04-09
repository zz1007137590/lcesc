Page({
    data: {
        markerList: []
    },
    onLoad() {
        this.fetchMarkerList();
    },
    fetchMarkerList() {
        wx.cloud.callFunction({
            name: 'getMarkerList',
            success: (res) => {
                if (res.result.success) {
                    console.log('加载的标注点列表数据:', res.result.data);
                    this.setData({
                        markerList: res.result.data
                    });
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.result.message,
                        showCancel: false
                    });
                }
            },
            fail: (err) => {
                console.error('调用云函数失败', err);
                wx.showModal({
                    title: '提示',
                    content: '调用云函数失败',
                    showCancel: false
                });
            }
        });
    },
    editMarker(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/editMarker/editMarker?id=${id}`
        });
    },
    deleteMarker(e) {
        const id = e.currentTarget.dataset.id;
        console.log('原始id:', id, '类型:', typeof id);
        wx.showModal({
            title: '提示',
            content: '确定要删除该标注点吗？',
            success: (res) => {
                if (res.confirm) {
                    const stringId = String(id);
                    console.log('转换后的id:', stringId, '类型:', typeof stringId);
                    wx.cloud.callFunction({
                        name: 'deleteMarker',
                        data: {
                            id: stringId
                        },
                        success: (res) => {
                            if (res.result.success) {
                                wx.showModal({
                                    title: '提示',
                                    content: res.result.message,
                                    showCancel: false,
                                    success: () => {
                                        this.fetchMarkerList();
                                    }
                                });
                            } else {
                                wx.showModal({
                                    title: '提示',
                                    content: res.result.message,
                                    showCancel: false
                                });
                            }
                        },
                        fail: (err) => {
                            console.error('调用云函数失败', err);
                            wx.showModal({
                                title: '提示',
                                content: '调用云函数失败',
                                showCancel: false
                            });
                        }
                    });
                }
            }
        });
    },
    goToAddPage() {
        wx.navigateTo({
            url: '/pages/addMarker/addMarker'
        });
    }
});