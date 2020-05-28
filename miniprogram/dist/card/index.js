import { link } from '../mixins/link';
import { VantComponent } from '../common/component';
VantComponent({
    classes: [
        'num-class',
        'desc-class',
        'thumb-class',
        'title-class',
        'price-class',
        'origin-price-class'
    ],
    mixins: [link],
    props: {
        tag: String,
        num: String,
        desc: String,
        thumb: String,
        title: String,
        price: {
            type: String,
            observer: 'updatePrice'
        },
        centered: Boolean,
        lazyLoad: Boolean,
        thumbLink: String,
        originPrice: String,
        thumbMode: {
            type: String,
            value: 'aspectFit'
        },
        currency: {
            type: String,
            value: '¥'
        }
    },
    methods: {
        updatePrice() {
            const { price } = this.data;
            const priceArr = price.toString().split('.');
            this.setData({
                integerStr: priceArr[0],
                decimalStr: priceArr[1] ? `.${priceArr[1]}` : ''
            });
        },
        onClickThumb() {
            this.jumpLink('thumbLink');
        },
     //图片放大
   previewImg:function(e){
    wx.previewImage({
      current: e.currentTarget.dataset.thumb,     //当前图片地址
      urls: [e.currentTarget.dataset.thumb],               //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
    }
});
