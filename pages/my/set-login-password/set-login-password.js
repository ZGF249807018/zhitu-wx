var app = getApp();
var util = require("../../../utils/request.js")
var url = app.globalData.webUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: "",
    smscode: "",
    password: "",
    passwordagin: "",
    gettime: false,
    counts: 0
  },
  //短信手机号
  getmobile(e) {
    this.setData({
      mobile: e.detail.value,
    })
  },
  bindblurtel() {
    if (!(/^1\d{10}$/.test(this.data.mobile))) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的电话号码',
      })
    } else {
      // wx.showToast({
      //   title: '电话号码正确',
      //   icon: 'succes',
      //   duration: 1000,
      //   mask: true
      // })
    }
  },
  //短信验证码
  getsmscode(e) {
    this.setData({
      smscode: e.detail.value,
    })
  },
  getcode() {
    if (this.isLock) {
      return false
    }
    this.isLock = true
    let that = this
    if (!that.data.mobile) {
      wx.showToast({
        title: '请输入手机号码',
      })
      return
    }
    util.request(
      "POST", "/api/tenant/v1/visit/sendCode", {
        "mobile": that.data.mobile,
        "bizType": "retrieve_pwd_code"
      }, that.getcodecallback, that.getcodeerrFun)
  },
  getcodecallback(res) {
    let that =this
   
    if (res.code == 200) {
      wx.showToast({
        title: '发送验证码成功',
      })
      that.setData({
        counts: 60
      });
      let getsix = setInterval(function () {
        if (that.data.counts < 2) {
          clearInterval(getsix);
          that.setData({
            gettime: false,
          });
        }
        var times = that.data.counts - 1
        that.setData({
          counts: times,
          gettime: true
        })
      }, 1000)
    } else {
      wx.showToast({
        title: res.msg,
        icon: "none"
      })
    }
    this.isLock = false
  },
  getcodeerrFun() {},
  //获得密码
  getpassword(e) {
    this.setData({
      password: e.detail.value,
    })
  },
  //确定密码
  getpasswordagin(e) {
    this.setData({
      passwordagin: e.detail.value,
    })
  },
  ok() {
    let that = this
    let token = app.globalData.token
    let usermessage = app.globalData.usermessage
    if (that.data.password === that.data.passwordagin) {
      let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
      if (!reg.test(that.data.password)) {
        wx.showModal({
          title: '提示',
          content: '请输入6-20位数字和字母组成的密码',
        })
      } else {
        wx.request({
          url: url + '/api/tenant/v1/retrievePassword/modifyLoginPassword',
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded" ,
            'Authorization': "bearer " + token,
          },
          data: {
            tenantId: usermessage.tenantId,
            userId: usermessage.userId,
            mobile: that.data.mobile,
            smsCode: that.data.smscode,
            password: that.data.password,
          },
          success: function(res) {
            
            if (res.data.code == 200) {
              wx.showToast({
                title: '设置密码成功',
                icon: "success",
                duration: 2000
              })
              wx.redirectTo({
                url: '/pages/login/login/login',
              })
            } else {
              wx.showModal({
                title: '提示',
                content: res.data.msg,
              })
            }
          }
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '输入的密码不一致',
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      mobile: app.globalData.tenantList.mobile
    });
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