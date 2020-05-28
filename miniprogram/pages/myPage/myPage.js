// pages/myPage/myPage.js
import Toast from 'path/to/../../../../dist/toast/toast';
const db = wx.cloud.database();
const stores= db.collection("stores");
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  onClick_1() {
    Toast.loading({
      mask: true,
      message: '加载中...',
    });
    wx.navigateTo({
      url: "../../pages/collectionPage/collectionPage",
    })
  },
  onClick() {
    if(getApp().globalData.user_openid=='oT20L45LxoE3DMT5c52-BJgw3gdo'){
      Toast.success('超级管理员！');
      wx.navigateTo({
        url: '../adminPage/adminPage'
      })
      return
    }
    stores.where({
      adminOpenid: getApp().globalData.user_openid,
    }).get().then(res => {
      console.log(res.data[0])
      if (res.data.length >= 1) {
        Toast.loading({
          mask: true,
          message: '加载中...',
        });
        wx.navigateTo({
          url: '../addProductTest/addProductTest?stores_id=' + res.data[0]._id,
        })
      } else {
        console.log(res);
        Toast.fail('暂无权限哦！');

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().init();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})