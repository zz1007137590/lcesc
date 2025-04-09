Page({
    data: {
        announcements: [],
        gearInput: '',
        modelInput: '',
        brandInput: '',
        gearKeywords: [],
        modelKeywords: [],
        brandKeywords: [],
        selectedKeyword: null,
        newAnnouncementInput: ''
    },
    onLoad() {
        this.getAnnouncements();
        this.getKeywords('gear');
        this.getKeywords('model');
        this.getKeywords('brand');
    },
    getAnnouncements() {
        wx.cloud.callFunction({
            name: 'getAnnouncements',
            success: res => {
                this.setData({
                    announcements: res.result
                });
            },
            fail: err => {
                console.error('获取公告失败', err);
                wx.showModal({
                    title: '提示',
                    content: '获取公告失败，请稍后重试。',
                    showCancel: false
                });
            }
        });
    },
    editAnnouncement(e) {
        const id = e.currentTarget.dataset.id;
        wx.showModal({
            title: '修改公告',
            content: '请输入新的公告内容',
            editable: true,
            success: res => {
                if (res.confirm) {
                    const newContent = res.content;
                    wx.cloud.callFunction({
                        name: 'updateAnnouncement',
                        data: {
                            id,
                            content: newContent
                        },
                        success: () => {
                            wx.showToast({
                                title: '修改成功',
                                icon: 'success'
                            });
                            this.getAnnouncements();
                        },
                        fail: err => {
                            console.error('修改公告失败', err);
                            wx.showModal({
                                title: '提示',
                                content: '修改公告失败，请稍后重试。',
                                showCancel: false
                            });
                        }
                    });
                }
            }
        });
    },
    setGearInput(e) {
        this.setData({
            gearInput: e.detail.value
        });
    },
    setModelInput(e) {
        this.setData({
            modelInput: e.detail.value
        });
    },
    setBrandInput(e) {
        this.setData({
            brandInput: e.detail.value
        });
    },
    setNewAnnouncementInput(e) {
        this.setData({
            newAnnouncementInput: e.detail.value
        });
    },
    addGearKeyword() {
        this.addKeyword('gear', this.data.gearInput);
        this.setData({
            gearInput: ''
        });
    },
    addModelKeyword() {
        this.addKeyword('model', this.data.modelInput);
        this.setData({
            modelInput: ''
        });
    },
    addBrandKeyword() {
        this.addKeyword('brand', this.data.brandInput);
        this.setData({
            brandInput: ''
        });
    },
    addNewAnnouncement() {
        const newAnnouncement = this.data.newAnnouncementInput;
        if (newAnnouncement.trim()!== '') {
            wx.cloud.callFunction({
                name: 'addAnnouncement',
                data: {
                    content: newAnnouncement
                },
                success: () => {
                    wx.showToast({
                        title: '公告添加成功',
                        icon: 'success'
                    });
                    this.setData({
                        newAnnouncementInput: ''
                    });
                    this.getAnnouncements();
                },
                fail: err => {
                    console.error('添加公告失败', err);
                    wx.showModal({
                        title: '提示',
                        content: '添加公告失败，请稍后重试。',
                        showCancel: false
                    });
                }
            });
        } else {
            wx.showModal({
                title: '提示',
                content: '请输入公告内容',
                showCancel: false
            });
        }
    },
    addKeyword(type, keyword) {
        if (keyword.trim()!== '') {
            wx.cloud.callFunction({
                name: 'addSingleKeyword',
                data: {
                    type,
                    keyword
                },
                success: () => {
                    wx.showToast({
                        title: '添加成功',
                        icon: 'success'
                    });
                    this.getKeywords(type);
                },
                fail: err => {
                    console.error(`添加${type}关键字失败`, err);
                    wx.showModal({
                        title: '提示',
                        content: `添加${type}关键字失败，请稍后重试。`,
                        showCancel: false
                    });
                }
            });
        }
    },
    getKeywords(type) {
        wx.cloud.callFunction({
            name: 'getKeywords',
            data: {
                type
            },
            success: res => {
                if (type === 'gear') {
                    this.setData({
                        gearKeywords: res.result.map(item => ({...item, isSelected: false }))
                    });
                } else if (type === 'model') {
                    this.setData({
                        modelKeywords: res.result.map(item => ({...item, isSelected: false }))
                    });
                } else if (type === 'brand') {
                    this.setData({
                        brandKeywords: res.result.map(item => ({...item, isSelected: false }))
                    });
                }
            },
            fail: err => {
                console.error(`获取${type}关键字失败`, err);
                wx.showModal({
                    title: '提示',
                    content: `获取${type}关键字失败，请稍后重试。`,
                    showCancel: false
                });
            }
        });
    },
    selectKeyword(e) {
        const { type, keyword, id } = e.currentTarget.dataset;
        let keywordList = [];
        if (type === 'gear') {
            keywordList = this.data.gearKeywords;
        } else if (type === 'model') {
            keywordList = this.data.modelKeywords;
        } else if (type === 'brand') {
            keywordList = this.data.brandKeywords;
        }
        const newKeywordList = keywordList.map(item => {
            if (item._id === id) {
                return {...item, isSelected:!item.isSelected };
            }
            return {...item, isSelected: false };
        });
        const selectedItem = newKeywordList.find(item => item.isSelected);
        if (type === 'gear') {
            this.setData({
                gearKeywords: newKeywordList,
                selectedKeyword: selectedItem? { type, keyword: selectedItem.keyword, id: selectedItem._id } : null
            });
        } else if (type === 'model') {
            this.setData({
                modelKeywords: newKeywordList,
                selectedKeyword: selectedItem? { type, keyword: selectedItem.keyword, id: selectedItem._id } : null
            });
        } else if (type === 'brand') {
            this.setData({
                brandKeywords: newKeywordList,
                selectedKeyword: selectedItem? { type, keyword: selectedItem.keyword, id: selectedItem._id } : null
            });
        }
    },
    deleteSelectedKeyword(e) {
        const { type } = e.currentTarget.dataset;
        const { selectedKeyword } = this.data;
        if (selectedKeyword && selectedKeyword.type === type) {
            wx.showModal({
                title: '确认删除',
                content: `确定要删除 ${selectedKeyword.keyword} 吗？`,
                success: res => {
                    if (res.confirm) {
                        wx.cloud.callFunction({
                            name: 'deleteKeyword',
                            data: {
                                type,
                                id: selectedKeyword.id
                            },
                            success: () => {
                                wx.showToast({
                                    title: '删除成功',
                                    icon: 'success'
                                });
                                this.getKeywords(type);
                                this.setData({
                                    selectedKeyword: null
                                });
                            },
                            fail: err => {
                                console.error(`删除${type}关键字失败`, err);
                                wx.showModal({
                                    title: '提示',
                                    content: `删除${type}关键字失败，请稍后重试。`,
                                    showCancel: false
                                });
                            }
                        });
                    }
                }
            });
        } else {
            wx.showModal({
                title: '提示',
                content: '请先选择要删除的关键字',
                showCancel: false
            });
        }
    }
});    