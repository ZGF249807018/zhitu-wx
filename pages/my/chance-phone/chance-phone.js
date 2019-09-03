const app = getApp();
const { webUrl } = app.globalData;
Page({
  data: {
    inputcontentpassword:"",
    inputcontenttel:"",
    tenantList: "",
    token: "",
    userList: "",
    counts: 0
  },
// 获取验证码
  getpassword () {
      if (this.isLock) {
        return false
      }
      this.isLock = true
      const vm = this;
      const { token, tenantList } = vm.data;
      wx.request({
        url: webUrl + `/api/tenant/v1/visit/sendCode`,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': "bearer " + token,
        },
        data: {
          mobile: tenantList.mobile,
          bizType: 'code_notice',
        },
        success: function (res) {
          if (res.data.code === 200) {
            wx.showToast({
              icon: 'success',
              title: '发送验证成功，请注意查收！',
            });
            vm.setData({
              counts: 60
            });
            let getsix = setInterval(function () {
              if (vm.data.counts < 2) {
                clearInterval(getsix);
                vm.setData({
                  gettime: false,
                });
              }
              var times = vm.data.counts - 1
              console.log(times)
              vm.setData({
                counts: times,
                gettime: true
              })
            }, 1000)
          } else {
            wx.showToast({
              icon: 'none',
              title: res.data.msg,
            });
          }
          this.isLock = false
        },
        fail: function (res) {

        },
        complete: function (res) {
        }
      });
  },
  submit() {
    const vm = this;
    const { tenantList, token, inputcontentpassword, inputcontenttel, userList } = vm.data;
    if (tenantList.mobile === inputcontenttel) {
      wx.showToast({
        title: '新手机号不能和老手机号一致',
        icon: "none"
      })
      return
    }
    wx.request({
      url: webUrl + `/api/tenant/v1/user/updateMobile`,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': "bearer " + token,
      },
      data: {
        oldMobile: tenantList.mobile,
        smsCode: inputcontentpassword,
        userId: userList.userId,
        newMobile: inputcontenttel
      },
      success: function (res) {
        if (res.data.code === 200) {
          wx.showToast({
            icon: 'success',
            title: '修改手机号成功!',
          });
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({
            icon: 'none',
            content: res.data.msg,
          });
        }
      },
      fail: function (res) {

      },
      complete: function (res) {
      }
    });
  },
  getPhoneCode(e) {
    this.setData({
      inputcontentpassword: e.detail.value
    })
  },
  getNowPhone(e) {
    this.setData({
      inputcontenttel: e.detail.value
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