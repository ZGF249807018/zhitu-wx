// pages/index/navigation/jobWantedTable/jobWantedTable.js
var app = getApp();
var https = app.globalData.https
const {
  webUrl
} = app.globalData;
Page({

  /**
   * 页面的初始数据
   *           //  3.候选人通过微信在线填写求职信息，提交后可在人才库里查看。
   */
  data: {
    imageUrl: https,
    text: `1.点击二维码然后长按，可将此二维码发送给候选人微信好友，也可将此二维码保存到手机相册，打印后使用。\n
           2.候选人通过微信、钉钉、支付宝扫码在线填写求职信息，提交后可在人才库里查看。\n
           `,
    logo: 1,
    userList: "",
    code: "",
    token: ""
  },

  saveImage(e) {
    const vm = this;
    const logo = e.currentTarget.dataset.logo;
    vm.setData({
      logo: logo
    })
  },
  jumpFrom() {
    let that = this
    wx.previewImage({
      urls: [that.data.code],
      current: that.data.code,

      success(res) {},
      fail(err) {}

    })
  },
  //请求二维码
  getercode() {
    const vm = this;
    vm.setData({
      userList: app.globalData.usermessage,
      token: app.globalData.token,
    })
    const {
      userList,
      token
    } = vm.data;
    wx.request({
      url: webUrl + '/api/tenant/v1/user/getQrCode?userId=' + userList.userId,
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': "bearer " + token,
      },
      success: function(res) {
        vm.setData({
          code: res.data.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    this.getercode()
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
  // onShareAppMessage: function() {
  //   return {
  //     title: '分享',
  //     path: '/pages/index/navigation/img/img?img='+this.data.code,
  //     success: function (res) {
  //       // 转发成功
  //       wx.showToast({
  //         title: "分享成功",
  //         icon: 'success',
  //         duration: 2000
  //       })
  //     },
  //     fail: function (res) {
  //       // 分享失败
  //     },
  //   }
  // }
})