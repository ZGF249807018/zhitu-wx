// pages/my/coupons/coupons.js
const app = getApp();
var https = app.globalData.https
const webUrl = app.globalData.webUrl;
var url = app.globalData.webUrl
var time = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    https: https,
    couponsList: [],
    unusedCouponsList: [],
    tenantList: {},
    logo: 1,
    onOff: true
  },
  toggleCondition(e) {
    const vm = this;
    const {
      logo
    } = vm.data;
    vm.setData({
      logo: e.target.dataset.logo
    })
  },
  //获取优惠卷
  getCoupons(num) {
    let that = this
    wx.request({
      url: webUrl + '/api/order/v1/couponRecord/list?tenantId=' + app.globalData.usermessage.tenantId + '&isExpired=' + num,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': "bearer " + app.globalData.token,
      },
      success: function(res) {
        if (res.data.code == 200) {
          let couponsList = res.data.data
          if (!couponsList) {
            return
          }
          couponsList.map((item) => {
            item.cost = item.cost / 100
          })
          if (num == 0) {
            that.setData({
              couponsList: couponsList
            })
          } else if (num == 1) {
            that.setData({
              unusedCouponsList: couponsList
            })
          }
        }
      }
    })
  },
  showUseRules() {
    let onOff = this.data.onOff;
    this.setData({
      onOff: !onOff
    });
  },
  enterbacktunes() {
    app.globalData.candidatemessage = ""
    app.globalData.candidate = ""
    app.globalData.candidateId = []
    this.certification(this.data.tenantList.certifyStatus, '/pages/index/back-tune/back-tune')
  },
  //认证状态
  certification(status, url) {
    if (status === '3') {
      wx.navigateTo({
        url: url,
      })
    } else if (status === '0') {
      wx.showModal({
        title: '温馨提示',
        content: '您还未进行企业认证，立即跳转认证页面',
        success: (result) => {
          if (result.confirm) {
            wx.navigateTo({
              url: '/pages/my/company-ok/company-ok',
            })
          }
        },
      });
    } else if (status === '1') {
      wx.showToast({
        icon: "none",
        title: "认证状态为审核中！",
        duration: 2000,
      });
    } else if (status === '2') {

      wx.showModal({
        title: '温馨提示',
        content: '企业认证失败，立即跳转认证页面',
        success: function (result) {
          if (result.confirm) {
            wx.navigateTo({
              url: '/pages/my/company-ok/company-ok',
            })
          } else if (result.cancel) {

          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCoupons(0)
    this.getCoupons(1)
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
    let that = this
    wx.request({
      url: url + '/api/tenant/v1/tenant/detail?tenantId=' + app.globalData.usermessage.tenantId,
      method: 'GET',
      header: {
        'Authorization': "bearer " + app.globalData.token,
      },
      success: function (res) {
        app.globalData.tenantList = res.data.data
        that.setData({
          tenantList: res.data.data
        })
      },
      fail: function (res) { },
      complete: function (res) { }
    });
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