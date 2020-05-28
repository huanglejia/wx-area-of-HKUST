import Toast from 'path/to/../../../../dist/toast/toast';
const db = wx.cloud.database();
const details = db.collection("stores_details");
const userColl = db.collection("userColl");
const _ = db.command;
let stores_id = null;//店铺ID
let detail_id = null;//商品ID
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible: false, //控制加载更多
    value: '',
    detail: [],   //商品集合
    detail_nums: 0,//商品数量
    show: false,//评价弹出层
    star:0,//用户评价星星
    isNotEvaluate:false,//用户是否可评价
    radio:'-1',//提交单选
    radioChecked:[false,false,false,false],
    evalLabelNum:[0,0,0,0],
    starLevel:0,//商品星级
    starLevelPersonNum:0// 商品星级评价人数
  },
  //搜索框
  onChange(e) {
    this.setData({
      value: e.detail,
    });
  },
  onChangeStar(e){
    this.setData({
      star: e.detail,
    });
  },
  onChangeRadio(event) {
    console.log(event.detail.value)
    this.setData({
      radio: event.detail.value,
    });
  },
  //评价提交
  onEvalButton:function(){
    if(this.data.star == 0){
      Toast.fail('请评分');
    }
    else if(this.data.radio==-1){
      Toast.fail('请选择标签');
    }
    else{
    //添加一次选中标签记录到数据库中
    for(let i = 0;i<4;i++){
      if(this.data.radio == i){
        this.data.evalLabelNum[i] += 1;
      }
      this.setData({
        evalLabelNum:this.data.evalLabelNum
      })

    }
      //将用户评价添加到商品评价集合中
    details.where({
      _id: detail_id
    })
    .update({
      data:{
        evaluate:_.push({
              star:this.data.star,
              openid:getApp().globalData.user_openid,
              evalLabel:this.data.radio
          }),
        evalLabelArr: this.data.evalLabelNum,
        starLevel:(this.data.starLevel*this.data.starLevelPersonNum+this.data.star)/(this.data.starLevelPersonNum+1)
      }
  })


  Toast.success('感谢您的评价');
  this.setData({
    isNotEvaluate:true,
  })


  
}
      
    
  }
,
//控制弹出层显示
  showPopup(e) {

    detail_id=e.currentTarget.dataset.id;
    console.log(detail_id)
     details.where({
       _id: e.currentTarget.dataset.id
     }).get().then(res => {
      if(res.data[0].evalLabelArr[0]==null){
        res.data[0].evalLabelArr=[0,0,0,0]
      }

      this.setData({
        evalLabelNum:res.data[0].evalLabelArr,
        starLevel:res.data[0].starLevel,
        starLevelPersonNum:res.data[0].evaluate.length
      })


      if(res.data[0].evaluate.length==0){
        this.setData({
          isNotEvaluate:false,
        })
      }
      console.log(this.data.isNotEvaluate)
      for(let i = 0;i<res.data[0].evaluate.length;i++){
        // console.log(res.data[0].evaluate[i].openid);
          if(res.data[0].evaluate[i].openid === getApp().globalData.user_openid){
            console.log("true");      //用户已评价  关闭评价通道
            this.setData({
              isNotEvaluate:true,
              star:res.data[0].evaluate[i].star,
            })
            let radioTemp = this.data.radioChecked
            for(let j = 0;j<4;j++){
              if(res.data[0].evaluate[i].evalLabel == j){
                radioTemp[j] = true;
                continue;
              }
              radioTemp[j] = false;
            }
            this.setData({
              radioChecked:radioTemp
            })

          }else{
            console.log("false");   //用户未评价  默认开启评价通道
            this.setData({
              isNotEvaluate:false,
            })
          }
      }
    })

    this.setData({ show: true });

  },
//控制弹出层隐藏
  onClose() {
    this.setData({ show: false,star:0,radioChecked:[false,false,false,false]});
  },

   //图片放大
   previewImg:function(e){

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
  /**
   * 页面上拉触底事件的处理函数
   */
  onBottom: function () {
    wx.showLoading({
      title: '刷新中！',
      duration: 500
    })


    let x = this.data.detail_nums + 20
    console.log(x)
    let old_data = this.data.detail
    details.where({
        stores_id: stores_id
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
          detail: old_data.concat(res.data),
          detail_nums: x
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

  oninsert: function (event) {
    userColl.where({
      _openid: getApp().globalData.user_openid,
    }).get().then(res => {
      if (res.data.length == 20) {
          Toast.fail('收藏已满！');
      } 
      else {
        userColl.where({
          _openid: getApp().globalData.user_openid,
          stores_details_id: event.currentTarget.dataset.id,
          stores_id: event.currentTarget.dataset.stores_id
        }).get().then(res => {
          if (res.data.length == 1) {
            console.log("数据库中有该用户记录，请核实nickname"),
              Toast.fail('已收藏!');
          } else {
            userColl.add({
              data: {
                stores_details_id: event.currentTarget.dataset.id,
                stores_id: event.currentTarget.dataset.stores_id
              }
            }).then(res => {
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
    stores_id = options.id;
    console.log(stores_id);
    details.where({
      // sCategory: "商店"
      stores_id: stores_id
    }).get().then(res => {
      console.log(res.data)
      if (res.data.length == 20) {
        this.setData({
          visible: true
        })
      }
      this.setData({
        detail: res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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