Component({
    externalClasses: ['i-class'],

    options: {
        multipleSlots: true
    },

    properties: {
        full: {
            type: Boolean,
            value: false
        },
        thumb: {
            type: String,
            value: ''
        },
        title: {
            type: String,
            value: ''
        },
        extra: {
            type: String,
            value: ''
        },
        id: {
            type: String,
            value: ''
        }
    },
    methods: {
        //图片放大
        previewImg: function (e) {
            console.log(e)
            wx.previewImage({
                current: e.currentTarget.dataset.thumb, //当前图片地址
                urls: [e.currentTarget.dataset.thumb], //所有要预览的图片的地址集合 数组形式
                success: function (res) {},
                fail: function (res) {},
                complete: function (res) {},
            })
        },
        onInter: function (e) {
            //   console.log(e.currentTarget.dataset.sid)
            wx.navigateTo({
                url: "../showListDetails/showListDetails?id=" + e.currentTarget.dataset.sid,
            })

        }

    }
});