const app = getApp();
const webUrl = app.globalData.webUrl;
// const usermessage = app.globalData.usermessage
Page({

  /**
   * 页面的初始数据
   */
  data: {
    https: app.globalData.https,
    balance: "",
    balanceList: [{
        image: app.globalData.https + "top-up.png",
        text: "充值",
        logo: app.globalData.https + "show.png",
        url: "/pages/my/recharge/recharge"
      },
      {
        image: app.globalData.https + "detail-particulars.png",
        text: "明细",
        logo: app.globalData.https + "show.png",
        url: "/pages/my/balance-detail/balance-detail"
      },
    ]
  },
  getbalance() {
    let that = this
    wx.request({
      url: webUrl + '/api/order//v1/balance/getBalance?tenantId=' + app.globalData.usermessage.tenantId,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': "bearer " + app.globalData.token,
      },
      success: function(res) {
        that.setData({
          balance:(res.data.data/100).toFixed(2)
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getbalance()
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
    this.getbalance()
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