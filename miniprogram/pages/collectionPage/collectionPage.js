const db = wx.cloud.database();
const details = db.collection("stores_details");
const userColl = db.collection("userColl");
const _ = db.command;
let detail_id = null;//商品ID
import Toast from 'path/to/../../../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: [],
    show: false,//评价弹出层
    star:0,//用户评价星星
    isNotEvaluate:false,//用户是否可评价
    radio:'-1',//提交单选
    radioChecked:[false,false,false,false],
    evalLabelNum:[0,0,0,0],
    starLevel:0,//商品星级
    starLevelPersonNum:0// 商品星级评价人数
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
  //评价提交e
  onEvalButton:function(e){
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
  onDelete: function (event) {
    var that = this
    userColl.where({
      _openid: getApp().globalData.user_openid,
      stores_details_id: event.currentTarget.dataset.id,
      stores_id: event.currentTarget.dataset.stores_id
    }).get().then(res => {
      console.log(res.data[0]._id)
      userColl.doc(res.data[0]._id).remove().then(res => {
        console.log(res)
        Toast.success('取消收藏');
        wx.reLaunch({
          url: '../../pages/collectionPage/collectionPage',
        })
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user_id = getApp().globalData.user_openid;
    // console.log(user_id);
    userColl.where({
      _openid: user_id,
    }).get().then(res => {
      //  console.log(res.data); 
      for (let i = 0; i < res.data.length; i++) {
        var id1 = res.data[i];
        // console.log(id1.stores_details_id);
        details.doc(id1.stores_details_id).get().then(res => {
          // console.log(res.data);
          // console.log(i);
          var item = 'detail[' + i + ']';
          this.setData({
            [item]: res.data
          })
        })
      }
    })
  },
})