
var app = getApp();
var https = app.globalData.https
var url = app.globalData.webUrl
var util = require("../../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: https,
    username: '',
    // 18657173016
    // lym11111
    eyes: {
      passwords: '',
      passwordshow: "password",
      img: {
        closeeye: https + 'invisible.png'
      }
    }
  },
  login() {
    let that = this
    if (!that.data.username){
      wx.showToast({
        title: '请输入用户名!',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return true
    }
    if (!that.data.eyes.passwords) {
      wx.showToast({
        title: '请输入密码!',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return true
    }
    wx.request({
      url: url + '/oauth2/oauth/token?grant_type=password',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded" ,
        'authorization': "Basic eHdmOmdpdmVtZWZpdmU=",
      },
      data: {
        username: that.data.username,
        password: that.data.eyes.passwords,
      },
      success: function(res) {
        if (res.statusCode === 200) {
          app.globalData.token = res.data.access_token
          wx.request({
            url: url + '/api/tenant/v1/user/info',
            method: "GET",
            header: {
              'Authorization': "bearer " + app.globalData.token,
            },
            success: function(res) {
              if (res.data.code == 200) {
                app.globalData.usermessage = res.data.data
                wx.request({
                  url: url + '/api/tenant/v1/tenant/detail?tenantId=' + res.data.data.tenantId,
                  method: 'GET',
                  header: {
                    'Authorization': "bearer " + app.globalData.token,
                  },
                  success: function(res) {
                    app.globalData.tenantList = res.data.data
                    wx.switchTab({
                      url: '/pages/index/index/index'
                    })
                  },
                  fail: function(res) {

                  },
                  complete: function(res) {}
                });

              }

              // let allmessgage = res.data

            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '账号密码不正确',
          })
        }
      }
    })



  },
  logincode(res) {},
  logincodeerr() {},
  chanceinput(e) {
    this.setData({
      username: e.detail.value,
    })
  },
  enterAgreement(){
    wx.navigateTo({
      url: '../agreement/agreement',
    })
  },
  // 点击眼睛
  showpassword() {
    if (this.data.eyes.passwordshow == "password") {
      this.setData({
        eyes: {
          passwords: this.data.eyes.passwords,
          passwordshow: "text",
          img: {
            closeeye: https + 'so.png',
          }
        }
      })
    } else {
      this.setData({
        eyes: {
          passwords: this.data.eyes.passwords,
          passwordshow: "password",
          img: {
            closeeye: https + 'invisible.png',
          }
        }
      })
    }
  },
  // 密码输入框输入触发事件
  getcontent(e) {
    this.setData({
      eyes: {
        passwords: e.detail.value,
        passwordshow: this.data.eyes.passwordshow,
        img: {
          closeeye: this.data.eyes.img.closeeye
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
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