
const db = wx.cloud.database();
const details = db.collection("stores_details");
const userColl = db.collection("userColl");
import Toast from 'path/to/../../../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible: false, //控制加载更多
    searchVal: "",
    detail:[],
    detail_nums:0,
    

  },
  clearInput:function(){
    wx.navigateBack({
    })
  },
//上拉刷新
  onBottom: function () {
    wx.showLoading({
      title: '刷新中！',
      duration: 500
    })
    let x = this.data.detail_nums + 20
    console.log(x)
    let old_data = this.data.detail
    details.where({
      title: db.RegExp({
        regexp: this.data.searchVal,//做为关键字进行匹配
        options: 'i',//不区分大小写
      })
    })
    .skip(x) // 限制返回数量为 20 条
      .get()
      .then(res => {
       // 这里是从数据库获取文字进行转换 变换显示（换行符转换） 
       console.log(res.data.length)
        // res.data.forEach((item, i) => {
      if(res.data.length==0){
        console.log("亲给不了你更多了")
        Toast.fail('亲给不了你更多了');
      }
      if(res.data.length==20){
      this.setData({
        visible: true
    })
  }
  else{
    this.setData({
      visible: false
  })
  }
      // 利用concat函数连接新数据与旧数据
      // 并更新emial_nums  
        this.setData({
          detail:old_data.concat(res.data),
          detail_nums: x
        })
        console.log(res.data)
      })
      .catch(err => {
        console.error(err)
      })
    console.log('circle 下一页');
  
  },


  onChange(e) {
    this.setData({
      searchVal: e.detail,
    });
  },
  onSearch() {
    console.log(this.data.searchVal);
  },
  onClick() {
    console.log(this.data.searchVal);
  },
  //当输入框不为空的时候 显示可清除输入图片
  clear: function () {
    this.setData({
      searchVal: ""
    })
  },

   //商品关键字模糊搜索
   search: function () {
    wx: wx.showLoading({
      title: '加载中',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    // //重新给数组赋值为空
    // this.setData({
    //   detail: []
    // })
    // 数据库正则对象
    details.where({
      title: db.RegExp({
        regexp: this.data.searchVal,//做为关键字进行匹配
        options: 'i',//不区分大小写
      })
    })
      .get().then(res => {
        if(res.data.length==20){
          this.setData({
            visible: true
        })
      }
        console.log(this.data.searchVal)
        console.log(res.data)
        this.setData({
          detail:res.data
        })
           wx.hideLoading();
        // }
      }).catch(err => {
        console.error(err)
        wx.hideLoading();
      })
  },
  oninsert:function(event){

    userColl.where({
        _openid:getApp().globalData.user_openid,
     }).get().then(res=>{
       if(res.data.length==20){
         console.log("数据库中有该用户记录，请核实nickname"),
         Toast.fail('收藏已满！');
     }
   
     else{
       userColl.where({
         _openid:getApp().globalData.user_openid,
         stores_details_id:event.currentTarget.dataset.id,
         stores_id:event.currentTarget.dataset.stores_id
     }).get().then(res=>{
       if(res.data.length==1){
           console.log("数据库中有该用户记录，请核实nickname"),
           Toast.fail('已收藏');
       }else{
         userColl.add({
           data:{
             stores_details_id:event.currentTarget.dataset.id,
             stores_id:event.currentTarget.dataset.stores_id
           }
         }).then(res=>{
           console.log(res);
           Toast.success('收藏成功');
         })
       }
     })
       
     }
     })
   
   },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var val = options.searchVal;
    console.log(val);
    this.setData({
      searchVal:val
    });
    var that=this; 
    that.search();
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // 调用云函数
    
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