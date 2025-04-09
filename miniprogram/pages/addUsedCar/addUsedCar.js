Page({
    data: {
        mainImage: '',
        detailImages: [],
        title: '',
        price: '',
        cost: '',
        brands: [],
        brandIndex: 0,
        gears: [],
        gearIndex: 0,
        models: [],
        modelIndex: 0,
        mileage: '',
        displacement: ''
    },
    onLoad() {
        this.getBrands();
        this.getGears();
        this.getModels();
    },
    getBrands() {
        wx.cloud.callFunction({
            name: 'getKeywords',
            data: {
                type: 'brand'
            },
            success: res => {
                this.setData({
                    brands: res.result
                });
            },
            fail: err => {
                console.error('获取品牌数据失败', err);
                wx.showModal({
                    title: '提示',
                    content: '获取品牌数据失败，请稍后重试。',
                    showCancel: false
                });
            }
        });
    },
    getGears() {
        wx.cloud.callFunction({
            name: 'getKeywords',
            data: {
                type: 'gear'
            },
            success: res => {
                this.setData({
                    gears: res.result
                });
            },
            fail: err => {
                console.error('获取挡位数据失败', err);
                wx.showModal({
                    title: '提示',
                    content: '获取挡位数据失败，请稍后重试。',
                    showCancel: false
                });
            }
        });
    },
    getModels() {
        wx.cloud.callFunction({
            name: 'getKeywords',
            data: {
                type: 'model'
            },
            success: res => {
                this.setData({
                    models: res.result
                });
            },
            fail: err => {
                console.error('获取车型数据失败', err);
                wx.showModal({
                    title: '提示',
                    content: '获取车型数据失败，请稍后重试。',
                    showCancel: false
                });
            }
        });
    },
    chooseMainImage() {
        wx.chooseImage({
            count: 1,
            success: res => {
                this.setData({
                    mainImage: res.tempFilePaths[0]
                });
            }
        });
    },
    chooseDetailImages() {
        wx.chooseImage({
            count: 9 - this.data.detailImages.length,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
                const validImages = res.tempFilePaths.filter(path => {
                    const ext = path.split('.').pop().toLowerCase();
                    return ['jpg', 'jpeg', 'png'].includes(ext);
                });
                this.setData({
                    detailImages: this.data.detailImages.concat(validImages)
                });
            }
        });
    },
    setTitle(e) {
        this.setData({
            title: e.detail.value
        });
    },
    setPrice(e) {
        this.setData({
            price: e.detail.value
        });
    },
    setCost(e) {
        this.setData({
            cost: e.detail.value
        });
    },
    setBrand(e) {
        this.setData({
            brandIndex: e.detail.value
        });
    },
    setGear(e) {
        this.setData({
            gearIndex: e.detail.value
        });
    },
    setModel(e) {
        this.setData({
            modelIndex: e.detail.value
        });
    },
    setMileage(e) {
        this.setData({
            mileage: e.detail.value
        });
    },
    setDisplacement(e) {
        this.setData({
            displacement: e.detail.value
        });
    },
    async submitForm() {
        const { mainImage, detailImages, title, price, cost, brands, brandIndex, gears, gearIndex, models, modelIndex, mileage, displacement } = this.data;
        if (!mainImage || detailImages.length === 0 ||!title ||!price ||!cost ||!brands[brandIndex] ||!gears[gearIndex] ||!models[modelIndex] ||!mileage ||!displacement) {
            wx.showModal({
                title: '提示',
                content: '请填写完整信息',
                showCancel: false
            });
            return;
        }
        try {
            const mainImageUrl = await this.uploadImage(mainImage);
            const detailImageUrls = await Promise.all(detailImages.map(this.uploadImage));
            const brand = brands[brandIndex].keyword;
            const gear = gears[gearIndex].keyword;
            const model = models[modelIndex].keyword;
            await wx.cloud.callFunction({
                name: 'addUsedCar',
                data: {
                    mainImage: mainImageUrl,
                    detailImages: detailImageUrls,
                    title,
                    price,
                    cost,
                    brand,
                    gear,
                    model,
                    mileage,
                    displacement
                }
            });
            wx.showToast({
                title: '数据提交成功',
                icon: 'success'
            });
            wx.navigateBack();
        } catch (err) {
            console.error('数据提交失败', err);
            wx.showModal({
                title: '提示',
                content: '数据提交失败，请稍后重试。',
                showCancel: false
            });
        }
    },
    uploadImage(filePath) {
        return new Promise((resolve, reject) => {
            const cloudPath = `used_car_images/${Date.now()}-${Math.random()}-${filePath.match(/[^\/]+$/)[0]}`;
            wx.cloud.uploadFile({
                cloudPath,
                filePath,
                success: res => {
                    resolve(res.fileID);
                },
                fail: err => {
                    reject(err);
                }
            });
        });
    }
});    