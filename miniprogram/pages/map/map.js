Page({
    data: {
      longitude: '',
      latitude: '',
      markers: []
    },
    onLoad() {
      this.getLocation();
      this.fetchMarkerList();
    },
    getLocation() {
      // 检查用户是否已经授权地理位置
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userLocation']) {
            // 用户已经授权，直接获取位置
            this.getPosition();
          } else {
            // 用户未授权，请求授权
            wx.authorize({
              scope: 'scope.userLocation',
              success: () => {
                this.getPosition();
              },
              fail: () => {
                wx.showModal({
                  title: '提示',
                  content: '您拒绝了位置授权，无法获取您的位置信息。',
                  showCancel: false
                });
              }
            });
          }
        }
      });
    },
    getPosition() {
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          const longitude = res.longitude;
          const latitude = res.latitude;
          this.setData({
            longitude: longitude,
            latitude: latitude,
            markers: [
              {
                id: 1,
                longitude: longitude,
                latitude: latitude,
                title: '您的位置'
              }
            ]
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
    goToMarkerListPage() {
      wx.navigateTo({
        url: '/pages/markerList/markerList'
      });
    },
    fetchMarkerList() {
      wx.cloud.callFunction({
        name: 'getMarkerList',
        success: (res) => {
          if (res.result.success) {
            const markers = res.result.data.map((item, index) => {
              return {
                id: index + 2,
                longitude: item.longitude,
                latitude: item.latitude,
                title: item.shopName
              };
            });
            this.setData({
              markers: [...this.data.markers, ...markers]
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