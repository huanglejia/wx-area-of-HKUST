// pages/details/details.js
import Toast from 'path/to/../../../../dist/toast/toast';
const db = wx.cloud.database();
const details = db.collection("stores_details");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
  },
  onUpdate: function (event) {
    // console.log(this.data.stores_id)
    // console.log(this.data.detail.stores_id)
    // console.log(event)
    // console.log(this.data.detail._id)
    // console.log(this.data.detail.stores_id)
    // console.log(event.detail.value.title)

    details.doc(this.data.detail._id).update({
      data: {
        title: event.detail.value.title,
        description: event.detail.value.description,
        price: event.detail.value.price
      }
    })
    Toast.success('更新成功');
    wx.navigateTo({
      url: '../addProductTest/addProductTest?stores_id=' + this.data.detail.stores_id,
    })
  },
  onDelete: function (event) {
    details.doc(this.data.detail._id).remove().then(res => {
      console.log(res)
      Toast.success('删除成功');
      wx.navigateTo({
        url: '../addProductTest/addProductTest?stores_id=' + this.data.detail.stores_id,
      })
    })
  },
  onChange(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // console.log(options);
    let id = options.id;
    details.doc(id).get().then(res => {
      //  console.log(res.data)

      this.setData({
        detail: res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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