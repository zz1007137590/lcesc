Page({
    data: {
        id: '',
        frontPhoto: '',
        detailPhotos: [],
        shopName: '',
        contactName: '',
        phoneNumber: '',
        address: ''
    },
    onLoad(options) {
        const id = options.id;
        this.setData({ id });
        this.fetchMarkerInfo();
    },
    fetchMarkerInfo() {
        const { id } = this.data;
        wx.cloud.callFunction({
            name: 'getMarkerInfo',
            data: { id },
            success: (res) => {
                if (res.result.success) {
                    const { frontPhoto, detailPhotos, shopName, contactName, phoneNumber, address } = res.result.data;
                    this.setData({
                        frontPhoto,
                        detailPhotos,
                        shopName,
                        contactName,
                        phoneNumber,
                        address
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
    uploadFrontPhoto() {
        wx.chooseImage({
            count: 1,
            success: (res) => {
                const tempFilePaths = res.tempFilePaths;
                this.setData({
                    frontPhoto: tempFilePaths[0]
                });
                wx.showModal({
                    title: '提示',
                    content: '门头照片上传完成',
                    showCancel: false
                });
            }
        });
    },
    uploadDetailPhotos() {
        wx.chooseImage({
            count: 9,
            success: (res) => {
                const tempFilePaths = res.tempFilePaths;
                this.setData({
                    detailPhotos: tempFilePaths
                });
                wx.showModal({
                    title: '提示',
                    content: '详细照片上传完成',
                    showCancel: false
                });
            }
        });
    },
    setShopName(e) {
        this.setData({
            shopName: e.detail.value
        });
    },
    setContactName(e) {
        this.setData({
            contactName: e.detail.value
        });
    },
    setPhoneNumber(e) {
        this.setData({
            phoneNumber: e.detail.value
        });
    },
    setAddress(e) {
        this.setData({
            address: e.detail.value
        });
    },
    showMapSuggestion() {
        // 实现地图联想功能
        console.log('显示地图联想');
    },
    submitEdit() {
        const { id, frontPhoto, detailPhotos, shopName, contactName, phoneNumber, address } = this.data;
        wx.cloud.callFunction({
            name: 'updateMarker',
            data: {
                id,
                frontPhoto,
                detailPhotos,
                shopName,
                contactName,
                phoneNumber,
                address
            },
            success: (res) => {
                if (res.result.success) {
                    wx.showModal({
                        title: '提示',
                        content: res.result.message,
                        showCancel: false,
                        success: () => {
                            wx.navigateBack();
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
});    