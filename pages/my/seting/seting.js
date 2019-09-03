const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setingList: [{
        text: "重置登录密码",
        image: app.globalData.https + "show.png",
        content: ""
      },
      {
        text: "设置支付密码",
        image: app.globalData.https + "show.png",
        content: ""
      },
      {
        text: "点击清除缓存",
        image: app.globalData.https + "show.png",
        content: ""
      }
    ]
  },
  quitLogs() {
    app.globalData.openId = ""
    app.globalData.sessionKey = ""
    app.globalData.token = ""
    app.globalData.candidate = ""
    app.globalData.candidatemessage = ""
    app.globalData.candidateId = []
    app.globalData.meal = ""
    app.globalData.usermessage = ""
   
    app.globalData.tenantList={ }
    wx.reLaunch({
      url: '/pages/login/login/login',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onClick(e) {
    if (e.target.dataset.id === 0) {
      wx.navigateTo({
        url: '../set-login-password/set-login-password',
      })
    } else if (e.target.dataset.id === 1) {
      wx.navigateTo({
        url: '../set-pay-password/set-pay-password'
      })
    } else if (e.target.dataset.id === 2) {
      wx.showModal({
        title: '提示',
        content: '请确定清除缓存',
        success(res) {
          if (res.confirm) {
           
            app.globalData.candidate = ""
            app.globalData.candidatemessage = ""
            app.globalData.candidateId = []
            app.globalData.meal = ""
            wx.clearStorageSync();  
          } else if (res.cancel) {
           
          }
        }
      })
    }
  },
  onLoad: function(options) {

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