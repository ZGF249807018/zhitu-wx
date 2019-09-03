
var app = getApp();
var https = app.globalData.https
var url = app.globalData.webUrl
var util = require("../../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: https
  },
  getPhoneNumber: function(e) {
    let that = this
    let iv = e.detail.iv
    let encryptedData = e.detail.encryptedData
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function(res) {}
      })
    } else if (e.detail.errMsg == 'getPhoneNumber:user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function(res) {}
      })
    } else if (e.detail.errMsg == 'getPhoneNumber:fail:cancel') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function(res) {}
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '同意授权',
        success: function(res) {
          //获取用户的所有的信息
          let openId = app.globalData.openId
          let sessionKey = app.globalData.sessionKey
          util.request(
            "POST", "/api/tenant/v1/visit/authForWX", {
              "openId": openId,
              "sessionKey": sessionKey,
              "mobileEncryptedData": encryptedData,
              "mobileIv": iv,
            }, that.messagecallback, that.messageerrFun)
        }
      })
    }
  },
  messagecallback(res) {
   
    if (res.code === 200) {
      app.globalData.token = res.data.token.substring(7)
      app.globalData.usermessage = res.data

      
      wx.request({
        url: url + '/api/tenant/v1/tenant/detail?tenantId=' + app.globalData.usermessage.tenantId,
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
        fail: function(res) {},
        complete: function(res) {}
      });
    } else {
      wx.showToast({
        title: '获取用户登录态失败！',
        icon: "none"
      })
      
    }

  },
  messageerrFun() {},

 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.login({
      success: res => {
        let that = this
        wx.request({
          url: app.globalData.webUrl + '/api/tenant/v1/visit/getWXBaseInfo',
          method: 'GET',
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/json;charset=utf-8'
          },
          success: function (res) {
            
            if (res.data.code == 200) {
              app.globalData.openId = res.data.data.openId
              app.globalData.sessionKey = res.data.data.sessionKey
            }
          }
        })
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