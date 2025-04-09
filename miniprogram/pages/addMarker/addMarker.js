Page({
    data: {
        frontPhoto: '',
        detailPhotos: [],
        shopName: '',
        contactName: '',
        phoneNumber: '',
        address: '',
        longitude: '',
        latitude: '',
        addressSuggestions: [],
        addressCache: {} // 新增：用于缓存地址联想建议
    },
    onLoad() {
        this.getLocation();
    },
    getLocation() {
        wx.getLocation({
            type: 'gcj02',
            success: (res) => {
                this.setData({
                    longitude: res.longitude,
                    latitude: res.latitude
                });
            },
            fail: (err) => {
                console.error('获取位置失败', err);
                wx.showModal({
                    title: '提示',
                    content: '获取位置信息失败，请检查网络或定位服务是否开启，建议将定位精度设置为高精度。',
                    showCancel: false
                });
            }
        });
    },
    onRegionChange(e) {
        if (e.type === 'end' && (e.causedBy === 'scale' || e.causedBy === 'drag')) {
            this.setData({
                longitude: e.detail.centerLocation.longitude,
                latitude: e.detail.centerLocation.latitude
            });
        }
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
        const inputValue = e.detail.value;
        this.setData({
            address: inputValue
        });
        if (inputValue) {
            this.getAddressSuggestions(inputValue);
        } else {
            this.setData({
                addressSuggestions: []
            });
        }
    },
    // 新增：获取地址联想建议
    async getAddressSuggestions(keyword) {
        const { addressCache } = this.data;
        // 检查缓存中是否有该关键字的结果
        if (addressCache[keyword]) {
            this.setData({
                addressSuggestions: addressCache[keyword]
            });
            return;
        }
    
        const { longitude, latitude } = this.data;
        wx.getLocation({
            type: 'gcj02',
            success: async (res) => {
                const token = await this.getToken();
    
                if (token) {
                    wx.request({
                        url: 'https://apis.map.qq.com/ws/place/v1/suggestion',
                        data: {
                            keyword,
                            location: `${res.latitude},${res.longitude}`,
                            region: '全国',
                            policy: 1
                        },
                        header: {
                            'Authorization': `Bearer ${token}`
                        },
                        success: (response) => {
                            if (response && response.data && response.data.status === 0) {
                                const suggestions = response.data.data;
                                this.setData({
                                    addressSuggestions: suggestions
                                });
                                // 更新缓存
                                this.setData({
                                    addressCache: {
                                        ...addressCache,
                                        [keyword]: suggestions
                                    }
                                });
                            } else {
                                console.error('获取地址联想建议失败', response && response.data? response.data.message : '未知错误');
                                wx.showModal({
                                    title: '提示',
                                    content: '获取地址联想建议失败，请稍后重试。',
                                    showCancel: false
                                });
                            }
                        },
                        fail: (err) => {
                            console.error('请求地址联想建议失败', err);
                            wx.showModal({
                                title: '提示',
                                content: '请求地址联想建议失败，请检查网络连接。',
                                showCancel: false
                            });
                        }
                    });
                }
            },
            fail: (err) => {
                console.error('获取当前位置失败', err);
                wx.showModal({
                    title: '提示',
                    content: '获取当前位置失败，请检查定位服务。',
                    showCancel: false
                });
            }
        });
    },
    // 新增：选择地址联想建议
    selectSuggestion(e) {
        const { address, location } = e.currentTarget.dataset;
        this.setData({
            address,
            longitude: location.lng,
            latitude: location.lat,
            addressSuggestions: []
        });
    },
    showMapSuggestion() {
        // 实现地图联想功能
        const { address } = this.data;
        if (address) {
            this.getAddressSuggestions(address);
        }
    },
    submitMarker() {
        const {
            frontPhoto,
            detailPhotos,
            shopName,
            contactName,
            phoneNumber,
            address,
            longitude,
            latitude
        } = this.data;

        // 输入验证
        if (!shopName) {
            wx.showModal({
                title: '提示',
                content: '请输入店铺名称',
                showCancel: false
            });
            return;
        }
        if (!contactName) {
            wx.showModal({
                title: '提示',
                content: '请输入联系人姓名',
                showCancel: false
            });
            return;
        }
        if (!phoneNumber) {
            wx.showModal({
                title: '提示',
                content: '请输入联系电话',
                showCancel: false
            });
            return;
        }
        if (!address) {
            wx.showModal({
                title: '提示',
                content: '请输入地址',
                showCancel: false
            });
            return;
        }
        if (!longitude || !latitude) {
            wx.showModal({
                title: '提示',
                content: '未获取到有效的经纬度信息',
                showCancel: false
            });
            return;
        }

        wx.cloud.callFunction({
            name: 'addMarker',
            data: {
                frontPhoto,
                detailPhotos,
                shopName,
                contactName,
                phoneNumber,
                address,
                longitude,
                latitude
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
    },
    async getToken() {
        const apiKey = '6KJBZ-5PSKQ-FCA5X-2JXEN-4RDOS-2MBDU';
        const secretKey = 'jpZ5GUhTXlJk8UCNgwsuTRLAK2QGt80G'; // 替换为你的 Secret Key
    
        try {
            const response = await new Promise((resolve, reject) => {
                wx.request({
                    url: 'https://example.com/api/token', // 替换为实际的认证端点
                    method: 'POST',
                    data: {
                        api_key: apiKey,
                        secret_key: secretKey
                    },
                    success: (res) => {
                        resolve(res);
                    },
                    fail: (err) => {
                        reject(err);
                    }
                });
            });
    
            if (response && response.data && response.data.status === 0) {
                return response.data.token;
            } else {
                console.error('获取 Token 失败，响应信息：', response);
                return null;
            }
        } catch (error) {
            console.error('请求 Token 时出现错误：', error);
            return null;
        }
    }
});