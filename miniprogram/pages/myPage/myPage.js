// pages/myPage/myPage.js
import Toast from 'path/to/../../../../dist/toast/toast';
const db = wx.cloud.database();
const stores= db.collection("stores");
const admin= db.collection("administrators");
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {},
//跳转我的收藏
  onClick_1() {
    Toast.loading({
      mask: true,
      message: '加载中...',
    });
    wx.navigateTo({
      url: "../../pages/collectionPage/collectionPage",
    })
  },
  //商家入口
  onClick() {

    admin.where({
      superAdminOpenid: getApp().globalData.user_openid,//超级管理员权限
    }).get().then(res=>{
      console.log(res)
      if(res.data.length==1){
        Toast.success('超级管理员！');
        wx.navigateTo({
          url: '../adminPage/adminPage'
        })
        return false;
      }
      else{
        stores.where({
          adminOpenid: getApp().globalData.user_openid,//商家管理人员
        }).get().then(res => {
          console.log(res.data[0])
          if (res.data.length >= 1) {
            Toast.success('管理员！');
            wx.navigateTo({
              url: '../addProductTest/addProductTest?stores_id=' + res.data[0]._id,
            })
          } else {
            console.log(res);
            Toast.fail('暂无权限哦！');
          }
        })


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