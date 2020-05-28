// var schoolData = require('../../resources/schoolData.js')
var config = require('../../utils/config.js');
const db = wx.cloud.database()
const yunmap = db.collection("map");

var ur = null;
Page({
   data: {
      tid: 0,
      bid: 0,
      build: {
         img: [] //加载中图片地址
      },
      imgCDN: config.imgCDN, //图片域名
   },
    //图片放大
    previewImg:function(e){
      wx.previewImage({
        current: config.imgCDN+this.data.build.img,     //当前图片地址
        urls: [config.imgCDN+this.data.build.img],               //所有要预览的图片的地址集合 数组形式
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    },
   onLoad: function (options) {
      // var that = this;
      var bid = parseInt(options.bid);
      var tid = parseInt(options.tid);
      // var data = schoolData.map[tid].data[bid];
         yunmap.get().then(res => {
               console.log(res.data[0].map[tid].data[bid])
               var data = res.data[0].map[tid].data[bid];
               this.setData({
                  bid: bid,
                  tid: tid,
                  build: data,
               });
         })
   },
})