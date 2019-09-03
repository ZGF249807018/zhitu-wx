// pages/index/meal-list/meal-list.js
var app = getApp();
var url = app.globalData.webUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mealListData: []
  },
  radioChange: function radioChange(evt) {
    let that = this
    let meal = ""
    for (let i = 0; i < that.data.mealListData.length; i++) {
      if (evt.detail.value == that.data.mealListData[i].id) {
        meal = that.data.mealListData[i]
      }
    }
    wx.navigateTo({
      url: '../back-tune/back-tune?meal=' + JSON.stringify(meal),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getallfixedList()
  },
  // 获取获取所有的固定套餐
  getallfixedList() {
    let token = app.globalData.token
    let that = this
    wx.request({
      url: url + '/api/package/v1/pkg/fixedList',
      method: "GET",
      header: {
        "Content-Type": "application/json" ,
        'Authorization': "bearer " + token,
      },
      success: function(res) {
        let mealItems = res.data.data
        for (let i = 0; i < mealItems.length; i++) {
          mealItems[i].price = (mealItems[i].price / 100).toFixed(2) 
        }
        if (res.data.code == 200) {
          that.setData({
            mealListData: mealItems
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