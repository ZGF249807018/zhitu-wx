const app = getApp();
const { webUrl } = app.globalData;
Page({
  data: {
    oldemail:"1024453923@qq.com",
    inputcontentpassword: "",
    inputcontentemail: "",
    tenantList: "",
    token: "",
    userList: ""
  },
  // 获取验证码
  getpassword() {
    const vm = this;
    const { token, userList } = vm.data;
    wx.request({
      url: webUrl + `/api/tenant/v1/tenant/sendEmail`,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': "bearer " + token,
      },
      data: {
        userId: userList.userId,
      },
      success: function (res) {
        if (res.data.code === 200) {
          wx.showToast({
            icon: 'success',
            title: '发送验证成功！',
            duration: 2000,
          });
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.msg,
          });
        }
      },
      fail: function (res) {

      },
      complete: function (res) {
      }
    });
  },
  submit() {
    const vm = this;
    const { userList, token, inputcontentpassword, inputcontentemail } = vm.data;
    if (!inputcontentpassword){
      wx.showToast({
        title: '请输入验证码!',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return true
    }
    if (!inputcontentemail) {
      wx.showToast({
        title: '请输入新的邮箱!',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return true
    }
    wx.request({
      url: webUrl + `/api/tenant/v1/tenant/bindEmail`,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': "bearer " + token,
      },
      data: {
        email: inputcontentemail,
        emailCode: inputcontentpassword,
        userId: userList.userId,
      },
      success: function (res) {
        if (res.data.code === 200) {
          wx.showToast({
            icon: 'success',
            title: '修改邮箱成功!',
          });
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.msg,
          });
        }
      },
      fail: function (res) {

      },
      complete: function (res) {

      }
    });
  },
  getEmailCode(e) {
    this.setData({
      inputcontentpassword: e.detail.value
    })
  },
  getEmail(e) {
    this.setData({
      inputcontentemail: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      tenantList: app.globalData.tenantList,
      userList: app.globalData.usermessage,
      token: app.globalData.token
    })
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