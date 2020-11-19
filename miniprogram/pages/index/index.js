// pages/index1/index1.js
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    banners: [],

  },
  onShow() {
    this.getTabBar().init();
  },
  onChange(e) {
    this.setData({
      value: e.detail,
    });
  },
  onSearch() {
    // Toast('搜索' + this.data.value);
    console.log(this.data.value)
    wx.navigateTo({
      url: '../pro_search/pro_search?searchVal=' + this.data.value,
    })
  },
  // onClick() {
  //   // Toast('搜索' + this.data.value);
  //   console.log(this.data.value)
  //   wx.navigateTo({
  //     url: '../pro_search/pro_search?searchVal=' + this.data.value,
  //   })

  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('banners').get().then(res => {
      this.setData({
        banners: res.data
      })
    })
  }
})