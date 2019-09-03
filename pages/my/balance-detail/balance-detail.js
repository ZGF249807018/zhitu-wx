// pages/my/balance-detail/balance-detail.js
const app = getApp();
const {
  webUrl
} = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    https: app.globalData.https,
    balanceDetailList: [],
    pageNum: 1,
    total: "",
    bottomShow: false,
    text: "正在加载数据！"
  },
  //获取交易列表信息
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const vm = this;
    vm.setData({
      userList: app.globalData.usermessage,
      token: app.globalData.token,
    })
    const {
      balanceDetailList,
      pageNum,
      userList,
      token
    } = vm.data;
    wx.request({
      url: webUrl + '/api/order/v1/billing/list',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': "bearer " + token,
      },
      data: {
        pageSize: 10,
        pageNum: pageNum,
        tenantId: userList.tenantId

      },
      success: function(res) {
        const data = res.data.data.list;
        for (let i = 0; i < data.length; i++) {
          data[i].createDate = data[i].createDate

          data[i].amount = (data[i].amount && (data[i].amount / 100).toFixed(2))
          data[i].balance = (data[i].balance && (data[i].balance / 100).toFixed(2))

        }
        vm.setData({
          balanceDetailList: data,
          total: res.data.data.total
        })

      },
      fail: function(res) {

      },
      complete: function(res) {}
    });
  },
  toDetail(e) {
    const {
      item
    } = e.target.dataset;
    wx.navigateTo({
      url: "../balance-detail-detail/balance-detail-detail?item=" + JSON.stringify(item)
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
    const vm = this;
    const {
      balanceDetailList,
      pageNum,
      userList,
      token,
      total
    } = vm.data;

    if (balanceDetailList.length >= total) {
      vm.setData({
        bottomShow: true,
        bottomText: "全部加载完毕！"
      })
      return;
    }
    vm.setData({
      userList: app.globalData.userList,
      token: app.globalData.token,
      pageNum: pageNum + 1,
      bottomShow: true,
      bottomText: "正在加载数据！"
    })
    wx.request({
      url: webUrl + '/api/order/v1/billing/list',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': "bearer " + token,
      },
      data: {
        pageSize: 10,
        pageNum: pageNum + 1,
        tenantId: userList.tenantId

      },
      success: function(res) {
        const data = res.data.data.list;

        for (let i = 0; i < data.length; i++) {
          data[i].createDate = data[i].createDate
          // .slice(0, 10)
          data[i].amount = (data[i].amount && (data[i].amount / 100).toFixed(2))
          data[i].balance = (data[i].balance && (data[i].balance / 100).toFixed(2))
        }
        balanceDetailList.push(...data)
        vm.setData({
          balanceDetailList: balanceDetailList,
          bottomShow: false
        })
      },
      fail: function(res) {

      },
      complete: function(res) {}
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})