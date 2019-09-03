var app = getApp();
var url = app.globalData.webUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moneyList: [{
        text: "￥200元",
        money: 200
      },
      {
        text: "￥500元",
        money: 500
      },
      {
        text: "￥1000元",
        money: 1000
      },
      {
        text: "￥5000元",
        money: 5000
      },
      {
        text: "￥20000元",
        money: 20000
      },
      {
        text: "其他金额",
        money: ""
      },
    ],
    i: 5,
    money: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  toggleMoney(e) {
    const vm = this;
    const {
      moneyList
    } = vm.data;
    vm.setData({
      i: e.target.dataset.i,
      money: moneyList[e.target.dataset.i].money
    })
  },
  rechangemoney(e) {
    this.setData({
      money: e.detail.value
    })
  },
  //充值
  defaultTap() {
    let that = this
    let token = app.globalData.token
    let usermessage = app.globalData.usermessage
    console.log(that.data.money)
    if (!that.data.money) {
      wx.showModal({
        title: '提示',
        content: '请输入充值金额',
      })
      return  false
    }
    let reg = /^[0-9]+$/
    if (!reg.test(that.data.money)) {
      wx.showModal({
        title: '提示',
        content: '充值金额需为整数',
      })
      return false
    }
    if (that.data.money < 100) {
      wx.showModal({
        title: '提示',
        content: '充值金额最低100元',
      })
      return false
    }
    if (that.data.money > 100000) {
      wx.showModal({
        title: '提示',
        content: '充值金额最高10万元',
      })
      return false
    }
    wx.request({
      url: url + '/api/order/v1/billing/recharge',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded" ,
        'Authorization': "bearer " + token,
      },
      data: {
        userId: usermessage.userId,
        amount: that.data.money * 100,
        payType: 2,
        isMiniSys: 1,
        openId: app.globalData.openId
      },
      success: function(res) {
        if (res.data.code == 200) {
          let wxrechangemoney = res.data.data
          wx.requestPayment({
            timeStamp: wxrechangemoney.timeStamp,
            nonceStr: wxrechangemoney.nonceStr,
            package: wxrechangemoney.packageParam,
            signType: 'MD5',
            paySign: wxrechangemoney.paySign,
            success(res) {
              
            },
            fail(res) {
              wx.showModal({
                title: '提示',
                content: res.msg,
              })
            }
          })
        }

      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})