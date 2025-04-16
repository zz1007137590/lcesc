Page({
    data: {
        usedCars: [],
        notices: [],
        brands: [],
        brandFilterIndex: 0,
        gears: [],
        gearFilterIndex: 0,
        models: [],
        modelFilterIndex: 0,
        maxMileage: 0,
        mileageFilter: 0,
        minYear: 0,
        maxYear: 0,
        yearFilter: 0,
        showMileageModal: false,
        showYearModal: false,
        tempMileageFilter: 0,
        tempYearFilter: 0
    },
    onLoad() {
        this.getUsedCars();
        this.getNotices();
        this.getBrands();
        this.getGears();
        this.getModels();
        this.getMileageRange();
        this.getYearRange();
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
    getMileageRange() {
        wx.cloud.callFunction({
            name: 'getMileageRange',
            success: res => {
                this.setData({
                    maxMileage: res.result.maxMileage,
                    mileageFilter: res.result.maxMileage,
                    tempMileageFilter: res.result.maxMileage
                });
            },
            fail: err => {
                console.error('获取公里数范围失败', err);
                wx.showModal({
                    title: '提示',
                    content: '获取公里数范围失败，请稍后重试。',
                    showCancel: false
                });
            }
        });
    },
    getYearRange() {
        wx.cloud.callFunction({
            name: 'getYearRange',
            success: res => {
                this.setData({
                    minYear: res.result.minYear,
                    maxYear: res.result.maxYear,
                    yearFilter: res.result.minYear,
                    tempYearFilter: res.result.minYear
                });
            },
            fail: err => {
                console.error('获取年份范围失败', err);
                wx.showModal({
                    title: '提示',
                    content: '获取年份范围失败，请稍后重试。',
                    showCancel: false
                });
            }
        });
    },
    setBrandFilter(e) {
        this.setData({
            brandFilterIndex: e.detail.value
        });
    },
    setGearFilter(e) {
        this.setData({
            gearFilterIndex: e.detail.value
        });
    },
    setModelFilter(e) {
        this.setData({
            modelFilterIndex: e.detail.value
        });
    },
    showMileageModal() {
        this.setData({
            showMileageModal: true
        });
    },
    setTempMileageFilter(e) {
        this.setData({
            tempMileageFilter: e.detail.value
        });
    },
    confirmMileageFilter() {
        this.setData({
            mileageFilter: this.data.tempMileageFilter,
            showMileageModal: false
        });
    },
    cancelMileageFilter() {
        this.setData({
            showMileageModal: false
        });
    },
    showYearModal() {
        this.setData({
            showYearModal: true
        });
    },
    setTempYearFilter(e) {
        this.setData({
            tempYearFilter: e.detail.value
        });
    },
    confirmYearFilter() {
        this.setData({
            yearFilter: this.data.tempYearFilter,
            showYearModal: false
        });
    },
    cancelYearFilter() {
        this.setData({
            showYearModal: false
        });
    },
    searchCars() {
        const { brands, brandFilterIndex, gears, gearFilterIndex, models, modelFilterIndex, mileageFilter, yearFilter, usedCars } = this.data;
        const selectedBrand = brands[brandFilterIndex] && brands[brandFilterIndex].keyword;
        const selectedGear = gears[gearFilterIndex] && gears[gearFilterIndex].keyword;
        const selectedModel = models[modelFilterIndex] && models[modelFilterIndex].keyword;

        let filteredCars = usedCars.filter(car => {
            const matchBrand =!selectedBrand || car.brand === selectedBrand;
            const matchGear =!selectedGear || car.gear === selectedGear;
            const matchModel =!selectedModel || car.model === selectedModel;
            const matchMileage = car.mileage <= mileageFilter;
            const matchYear = car.year >= yearFilter;
            return matchBrand && matchGear && matchModel && matchMileage && matchYear;
        });

        this.setData({
            usedCars: filteredCars
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