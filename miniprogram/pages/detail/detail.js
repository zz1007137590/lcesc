Page({
    data: {
        car: {},
        carImages: [],
        touchStartX: 0,
        touchMoveX: 0,
        currentImageIndex: 0,
        scrollLeft: 0
    },
    onLoad(options) {
        const car = JSON.parse(options.car);
        if (!car.detailImages) {
            car.detailImages = [];
        }
        const carImages = [car.mainImage, ...car.detailImages];
        if (carImages.length === 0) {
            console.error('车辆图片数据为空');
            wx.showToast({
                title: '未找到车辆图片',
                icon: 'none'
            });
        }
        console.log('car.detailImages:', car.detailImages);
        this.setData({
            car,
            carImages
        });
    },
    onTouchStart(e) {
        this.setData({
            touchStartX: e.touches[0].pageX
        });
    },
    onTouchMove(e) {
        this.setData({
            touchMoveX: e.touches[0].pageX
        });
    },
    onTouchEnd(e) {
        const { touchStartX, touchMoveX, currentImageIndex, carImages } = this.data;
        const deltaX = touchMoveX - touchStartX;
        if (deltaX < -50 && currentImageIndex < carImages.length - 1) {
            this.setData({
                currentImageIndex: currentImageIndex + 1
            });
            this.scrollToImage(currentImageIndex + 1);
        } else if (deltaX > 50 && currentImageIndex > 0) {
            this.setData({
                currentImageIndex: currentImageIndex - 1
            });
            this.scrollToImage(currentImageIndex - 1);
        }
    },
    scrollToImage(index) {
        wx.createSelectorQuery().select('.image-scroll-view').node().exec((res) => {
            if (res[0]) {
                const scrollView = res[0].node;
                const imageWidth = scrollView.width;
                const offset = index * imageWidth;
                scrollView.scrollTo({
                    scrollLeft: offset,
                    duration: 300
                });
            }
        });
    }
});    