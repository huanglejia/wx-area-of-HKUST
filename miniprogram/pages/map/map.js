var schoolData = require('../../resources/schoolData.js')
var config = require('../../utils/config.js');
const db = wx.cloud.database()
const yunmap = db.collection("map");
Page({
   data: {
      TabCur: 0,
      scrollLeft: 0,
      fullScreen: false, //全屏
      isSelectedBuildType: 0, //选中的景观类型
      isSelectedBuild: 0, //选中的景观
      buildlData: schoolData.map, //默认地图数据
      latitude: 37.979244, //默认纬度
      longitude: 114.516661, //默认经度
      imgCDN: config.imgCDN, //图片域名
      urls:{}  //当前标签图片集合
   },
   onShow() {
      this.getTabBar().init();
   },
   //图片放大
   previewImg:function(e){
      // console.log(e.currentTarget.dataset.index);
      // console.log(this.data.buildlData[this.data.isSelectedBuildType].data);
      var index = e.currentTarget.dataset.index;
      console.log(config.imgCDN+this.data.buildlData[this.data.isSelectedBuildType].data[index].img[0])
      wx.previewImage({
        current: config.imgCDN+this.data.buildlData[this.data.isSelectedBuildType].data[index].img[0],     //当前图片地址
        urls: [config.imgCDN+this.data.buildlData[this.data.isSelectedBuildType].data[index].img[0]],               //所有要预览的图片的地址集合 数组形式
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    },
   onLoad: function () {
      //map中数据
      var that = this;
      //如果已经授权，提前获取定位信息
      wx.getSetting({
         success(res) {
            if (res.authSetting['scope.userLocation']) {
               //获取地理位置
               wx.getLocation({
                  type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
                  success: function (res) {
                     that.data.latitude = res.latitude;
                     that.data.longitude = res.longitude;
                  }
               })
            }
         }
      })
      //联网请求云数据
      that.LoadCloudchoolData();
   },
   LoadCloudchoolData: function () {
      var that = this
      //加入云环境ID
      wx.cloud.init({
         traceUser: true,
         env: 'test-q5765'
      })
      const db = wx.cloud.database();
      db.collection('map').get().then(res => {
         console.log(res.data[0].map)
        this.setData({
          buildlData:res.data[0].map
        })
      })
   },

   //视野发生变化时触发
   regionchange(e) {
      // console.log(e.type)
   },
   //点击标记点时触发
   markertap(e) {
      var that = this
      that.setData({
         isSelectedBuild: iconIndex,
      })
   },

   //切换tab
   tabSelect(e) {
      var that = this;
      that.setData({
         TabCur: e.currentTarget.dataset.id,
         scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
         latitude: this.data.buildlData[e.currentTarget.dataset.id].data[0].latitude,
         longitude: this.data.buildlData[e.currentTarget.dataset.id].data[0].longitude
         
      })
      that.setData({
         isSelectedBuildType: e.currentTarget.dataset.id,
         isSelectedBuild: 0
      });


   },

   //全屏显示
   fullScreenDisplay: function (e) {
      var that = this;
      that.setData({
         fullScreen: !that.data.fullScreen
      })
   },

   //跳转搜索页
   navigateToSearch() {
      wx.navigateTo({
         url: '../search/search'
      })
   },

   //获取当前位置
   getLocation: function () {
      var that = this
      wx.getLocation({
         // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
         type: 'wgs84',
         success: function (res) {
            // app.globalData.latitude = res.latitude;
            // app.globalData.longitude = res.longitude;
            that.setData({
               longitude: res.longitude,
               latitude: res.latitude
            })
         },
         fail: function () {
            wx.showModal({
               title: '无法使用定位',
               content: '请点击右上角菜单在设置中给予使用位置权限',
               showCancel: false,
               success: function (res) {}
            });
         }
      })
   },
})