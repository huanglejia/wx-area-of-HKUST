var app = getApp();
var amapFile = require('../../utils/amap-wx.js');
Page({
   data: {
      latitude: app.globalData.latitude, //纬度
      longitude: app.globalData.longitude, //经度

      markers: [],
      polyline: [],
      distance: '',
      time: ''
   },

   onLoad: function (options) {
      var that = this;

      wx.getLocation({
         type: 'gcj02',
         success: function (res) {
            app.globalData.latitude = res.latitude;
            app.globalData.longitude = res.longitude;
            that.setData({
               latitude: res.latitude,
               longitude: res.longitude
            });
            that.RoutePlanning(options);
         },
         fail: function () {
            wx.showModal({
               title: '无法使用路径规划',
               content: '请点击右上角菜单在设置中给予使用位置权限',
               showCancel: false,
               success: function (res) {
                  wx.navigateBack({
                     delta: 1
                  })
               }
            });
         }
      })
   },

   RoutePlanning: function (options) {
      var that = this;
      var myAmapFun = new amapFile.AMapWX({
         key: require('../../utils/config.js').key
      });

      let distance = Math.abs(that.data.longitude - options.longitude) + Math.abs(that.data.latitude - options.latitude);

      let routeData = {
         origin: that.data.longitude + ',' + that.data.latitude,
         destination: options.longitude + ',' + options.latitude,
         success: function (data) {
            var points = [];
            if (data.paths && data.paths[0] && data.paths[0].steps) {
               var steps = data.paths[0].steps;
               for (var i = 0; i < steps.length; i++) {
                  var poLen = steps[i].polyline.split(';');
                  for (var j = 0; j < poLen.length; j++) {
                     points.push({
                        longitude: parseFloat(poLen[j].split(',')[0]),
                        latitude: parseFloat(poLen[j].split(',')[1])
                     })
                  }
               }
            }
            that.setData({
               markers: [{
                  width: "25",
                  height: "35",
                  iconPath: "/style/img/map/mapicon_start.png",
                  latitude: that.data.latitude,
                  longitude: that.data.longitude
               }, {
                  width: "25",
                  height: "35",
                  iconPath: "/style/img/map/mapicon_end.png",
                  latitude: options.latitude,
                  longitude: options.longitude
               }],
               polyline: [{
                  points: points,
                  color: "#71246c",
                  width: 5
               }]
            });
            if (data.paths[0] && data.paths[0].distance) {
               var distance = data.paths[0].distance;

               if (distance < 1000) {
                  that.setData({
                     distance: (data.paths[0].distance).toFixed(2) + 'm'
                  });

               } else {
                  that.setData({
                     distance: (distance / 1000).toFixed(2) + 'Km'
                  });
               }
               console.log("distance:" + that.data.distance)
            }
            if (data.paths[0] && data.paths[0].duration) {
               var time = parseInt(data.paths[0].duration / 60);
               if (time < 60) {
                  that.setData({
                     time: time.toFixed(2) + '分钟'
                  });
               } else {
                  that.setData({
                     time: (time / 60).toFixed(2) + '小时'
                  });
               }
            }

         },
         fail: function (info) {}
      }
      if (distance < 0.85) {
         //  步行
         myAmapFun.getWalkingRoute(routeData);
      } else {
         //  驾车
         myAmapFun.getDrivingRoute(routeData);
      }
   }
})