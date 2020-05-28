// pages/showList/showList.js
const db = wx.cloud.database();
const stores = db.collection("stores");
var Category = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    store: [],
    store_num: 0,
    visible: false, //控制加载更多
  },
  onBottom: function () {
    wx.showLoading({
      title: '刷新中！',
      duration: 500
    })
    let x = this.data.store_num + 20
    console.log(x)
    let old_data = this.data.store
    stores.where({
        // sCategory: "商店"
        sCategory: Category
      }).skip(x) // 限制返回数量为 20 条
      .get()
      .then(res => {
        // 这里是从数据库获取文字进行转换 变换显示（换行符转换） 
        console.log(res.data.length)
        // res.data.forEach((item, i) => {
        if (res.data.length == 0) {
          console.log("亲给不了你更多了")
          Toast.fail('亲给不了你更多了');
        }
        if (res.data.length == 20) {
          this.setData({
            visible: true
          })
        } else {
          this.setData({
            visible: false
          })
        }
        // 利用concat函数连接新数据与旧数据
        // 并更新emial_nums  
        this.setData({
          store: old_data.concat(res.data),
          store_num: x
        })
        console.log(res.data)
      })
      .catch(err => {
        console.error(err)
      })
    console.log('circle 下一页');

  },




  onSearch() {
    // Toast('搜索' + this.data.value);
    console.log(this.data.value),
      wx.navigateTo({
        url: '../pro_search/pro_search?searchVal=' + this.data.value,
      })
  },
  onClick() {
    // Toast('搜索' + this.data.value);
    console.log(this.data.value)
    wx.navigateTo({
      url: '../pro_search/pro_search?searchVal=' + this.data.value,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    Category = options.category;
    console.log(Category);
    stores.where({
      // sCategory: "商店"
      sCategory: Category
    }).get().then(res => {
      if (res.data.length == 20) {
        this.setData({
          visible: true
        })
      }
      console.log(res.data);
      this.setData({
        store: res.data
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