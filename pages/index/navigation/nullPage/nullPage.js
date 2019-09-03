const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    https: app.globalData.https,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.content == 3) {
      wx.setNavigationBarTitle({
        title: '职盟',
      })
    } else if (options.content == 2) {
      wx.setNavigationBarTitle({
        title: '我的客服',
      })
    } else if (options.content == 4) {
      wx.setNavigationBarTitle({
        title: '职兔币',
      })
    }
  },
  toIndex() {
    wx.switchTab({
      url: "/pages/index/index/index"
    })
  },
  know() {
    wx.navigateBack({
      detail: 1
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