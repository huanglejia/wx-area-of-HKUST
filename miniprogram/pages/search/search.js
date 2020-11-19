var app = getApp();
var schoolData = require('../../resources/schoolData.js')
var config = require('../../utils/config.js');
const yunmap = db.collection("map");
Page({

   data: {
      keyword: null,
      showData: null,
      buildlData: schoolData.map,
      imgCDN: config.imgCDN, //图片域名
   },

   bindSearchInput: function (e) {
      var that = this;
      var inputData = e.detail.value.replace(/(^\s*)|(\s*$)/g, "");
      if (inputData) {
         that.HandleSearch(inputData);
      } else {
         that.setData({
            showData: null
         });
      }
   },

   HandleSearch: function (inputData) {
      var that = this;
      var searchData = that.data.buildlData;
      var showData = new Array();
      var index = 0;
      for (var x in searchData) {
         for (var y in searchData[x].data) {
            if (searchData[x].data[y].name.indexOf(inputData) != -1 || (searchData[x].data[y].address && searchData[x].data[y].address.indexOf(inputData) != -1) || searchData[x].data[y].description.indexOf(inputData) != -1) {
               var build = searchData[x].data[y];
               build.tid = x;
               build.bid = y;
               index = index + 1;
               build.index = index
               showData.push(build);
            }
         }
      }
      that.setData({
         showData: showData
      });
   },

   bindReset: function () {
      var that = this;
      that.setData({
         keyword: null,
         showData: null
      });
   },
   onLoad: function () {
      yunmap.get().then(res => {
        this.setData({
          buildlData:res.data[0].map
        })
      })
   },

})