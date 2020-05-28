import Toast from 'path/to/../../../../dist/toast/toast';
const db = wx.cloud.database();
const details = db.collection("stores_details");
var stores_id = null;
var pictureurl = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    tempImg:null
  },
  uploadImgHandle: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        this.setData({
          tempImg: tempFilePaths
        })
      }
    })
  },
  onSubmit: function (event) {
    console.log(event.detail.value)
    if(event.detail.value.title == ""){
      Toast.fail('请输入商品标题');
      return
    }
    if(event.detail.value.description == ""){
      Toast.fail('请输入商品描述');
      return
    }
    if(event.detail.value.price == ""){
      Toast.fail('请输入商品价格');
      return
    }
    if(this.data.tempImg == null){
      Toast.fail('请上传商品图片');
      return
    }

    wx.showLoading({
      title: '提交中',
    })
    const promiseArr = []
    //只能一张张上传 遍历临时的图片数组
    for (let i = 0; i < this.data.tempImg.length; i++) {
      let filePath = this.data.tempImg[i]
      let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
      //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
      promiseArr.push(new Promise((reslove, reject) => {
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix,
          filePath: filePath, // 文件路径
        }).then(res => {
          // get resource ID
          console.log(res.fileID)
          details.add({
            data: {
              title: event.detail.value.title,
              description: event.detail.value.description,
              price: event.detail.value.price,
              stores_id: stores_id,
              picture: res.fileID,
              starLevel: 0,
              evalLabelArr:[0,0,0,0,],//标签评价个数
              evaluate:[], //评价数组
                
            }
          }).then(res => {
            console.log(res);
          })
          Toast.success('提交成功');
          wx.navigateTo({
            url: '../addProductTest/addProductTest?stores_id=' + stores_id,
          })
          pictureurl = res.fileID,
            this.setData({
              fileIDs: this.data.fileIDs.concat(res.fileID)
            })
          reslove()
        }).catch(error => {
          console.log(error)
        })
      }))
    }
    Promise.all(promiseArr).then(res => {
      db.collection('comments').add({
          data: {
            fileIDs: this.data.fileIDs //只有当所有的图片都上传完毕后，这个值才能被设置，但是上传文件是一个异步的操作，你不知道他们什么时候把fileid返回，所以就得用promise.all
          }
        })
        .then(res => {
          console.log(res)
          wx.hideLoading()
          wx.showToast({
            title: '提交成功',
          })
        })
        .catch(error => {
          console.log(error)
        })
    })

    // console.log(event.detail.value)

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    stores_id = options.id;
    console.log(stores_id)
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