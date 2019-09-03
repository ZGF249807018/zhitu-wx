// pages/login/set-password/set-password.js
var app = getApp();
var https = app.globalData.https
var util = require("../../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: https,

    mobile: "",
    smsCode: "",
    encryptKey: "",
    loginPassword: "",

    eye: {
      passwordshow: "password",
      img: {
        closeeye: https + 'invisible.png'
      }
    },

    eyes: {
      passwordshow: "password",
      img: {
        closeeye: https + 'invisible.png'
      }
    },


    passwords: "",
    passwordsagin: ""


  },
  ok() {
    if (!this.data.passwords) {
      wx.showToast({
        title: '请输入密码!',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return true
    }
    if (this.data.passwords.length < 6) {
      wx.showToast({
        title: '密码长度必须大于6位!',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return true
    }
    const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
    if (!reg.test(this.data.passwords)) {
      wx.showToast({
        title: '密码必须包含数字加字母!',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return true
    }
    if (!this.data.passwordsagin) {
      wx.showToast({
        title: '请确认密码!',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return true
    }
    if (this.data.passwords != this.data.passwordsagin) {
      wx.showToast({
        title: '两次密码不一致!',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return true
    }
    util.request(
      "POST", "/api/tenant/v1/retrievePassword/login/setLoginPwd", {
        "mobile": this.data.mobile,
        "encryptKey": this.data.encryptKey,
        "loginPassword": this.data.passwords
      }, this.pwdcallback, this.pwderrFun)
  },
  pwdcallback(res) {
    if (res.data) {
      wx.showModal({
        title: '提示',
        content: '密码修改成功',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login-phone/login-phone'
            })
          } else {
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: res.msg
      })
    }
  },
  pwderrFun(err) {
    
  },
  chancepassword(e) {
   
    this.setData({
      passwords: e.detail.value,
    })
    
  
  },
  chancepasswordagin(e) {
   
    this.setData({
      passwordsagin: e.detail.value,
    })
    
  },
  //点击第一只眼睛
  showpassword() {
 
    let that = this
    if (this.data.eye.passwordshow == "password") {
      
      this.setData({
        passwords: that.data.passwords,
        eye: {
          passwordshow: "text",
          img: {
            closeeye: https + 'so.png',
          }
        }
      })
      
    } else {
      this.setData({
        passwords: this.data.passwords,
        eye: {
          passwordshow: "password",
          img: {
            closeeye: https + 'invisible.png',
          }
        }
      })
    }
  },
  // 点击第二只眼睛
  showpasswords() {
    let that = this
    if (this.data.eyes.passwordshow == "password") {
      this.setData({
        passwordsagin: that.data.passwordsagin,
        eyes: {
          passwordshow: "text",
          img: {
            closeeye: https + 'so.png',
          }
        }
      })
      
    } else {
      this.setData({
        passwordsagin: this.data.passwordsagin,
        eyes: {
          passwordshow: "password",
          img: {
            closeeye: https + 'invisible.png',
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.tel) {
      
      this.setData({
        mobile: options.tel,
        smsCode: options.messagecode,
        encryptKey: options.encryptKey
      })
    }
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