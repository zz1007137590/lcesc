Component({
    properties: {
        tabBarList1: {
            type: Array,
            value: [
                {
                    "pagePath": "pages/second/second",
                    "text": "选车",
                    "iconPath": "images/tabbar/second.png",
                    "selectedIconPath": "images/tabbar/second_active.png"
                },
                {
                    "pagePath": "pages/map/map",
                    "text": "地图",
                    "iconPath": "images/tabbar/map.png",
                    "selectedIconPath": "images/tabbar/map_active.png"
                },
                {
                    "pagePath": "pages/shop/shop",
                    "text": "商城",
                    "iconPath": "images/tabbar/shop.png",
                    "selectedIconPath": "images/tabbar/shop_active.png"
                },
                {
                    "pagePath": "pages/my/my",
                    "text": "我的",
                    "iconPath": "images/tabbar/my.png",
                    "selectedIconPath": "images/tabbar/my_active.png"
                }
            ]
        },
        tabBarList2: {
            type: Array,
            value: [
                {
                    "pagePath": "pages/usedCarList/usedCarList",
                    "text": "二手车列表",
                    "iconPath": "images/tabbar/usedCarList.png",
                    "selectedIconPath": "images/tabbar/usedCarList_active.png"
                },
                {
                    "pagePath": "pages/general/general",
                    "text": "通用页面",
                    "iconPath": "images/tabbar/general.png",
                    "selectedIconPath": "images/tabbar/general_active.png"
                },
                {
                    "pagePath": "pages/markerList/markerList",
                    "text": "标记列表",
                    "iconPath": "images/tabbar/markerList.png",
                    "selectedIconPath": "images/tabbar/markerList_active.png"
                },
                {
                    "pagePath": "pages/shop-admin/shop-admin",
                    "text": "商城管理",
                    "iconPath": "images/tabbar/shop-admin.png",
                    "selectedIconPath": "images/tabbar/shop-admin_active.png"
                }
            ]
        },
        color: {
            type: String,
            value: "#000000"
        },
        selectedColor: {
            type: String,
            value: "#1aad19"
        }
    },
    data: {
        currentTab: ''
    },
    lifetimes: {
        attached() {
            const pages = getCurrentPages();
            const currentPage = pages[pages.length - 1];
            this.setData({
                currentTab: `pages/${currentPage.route}`
            });
        }
    },
    methods: {
        switchTab(e) {
            const url = e.currentTarget.dataset.url;
            wx.switchTab({
                url: `/${url}`,
                success: () => {
                    this.setData({
                        currentTab: url
                    });
                }
            });
        }
    }
});