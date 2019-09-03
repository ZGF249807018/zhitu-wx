var app = getApp();
var https = app.globalData.https
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: https,
    token: "",
    usermessage: "",
    userInfo: app.globalData.userInfo,
    tenantList: "",
    images: app.globalData.images,
    alreadyBackNum: "",
    canceledCount: "",
    processingCount: "",
    balance: "",
    couponRecord: "",
    showUnit: false
  },
  enterLogin() {
    wx.navigateTo({
      url: '../../login/login/login',
    })
  },
  openImg(e) {
    let logo = e.currentTarget.dataset.logo
    if (logo){
      wx.navigateTo({
        url: '/pages/my/header/header?logo=' + logo,
      })
    }else {
      wx.navigateTo({
        url: '/pages/my/header/header',
      })
    }

  },
  enterdetailmessage() {
    if (!app.globalData.token) {
      wx.showModal({
        title: '温馨提示',
        content: '用户未登录，点击登录',
        success: (result) => {
          if (result.confirm) {
            wx.navigateTo({
              url: '/pages/login/login/login',
            })
          }
        },
      });
      return
    }
    wx.navigateTo({
      url: '../basicmessage/basicmessage',
    })
  },
  // 进入余额
  enterbalancedetail() {
    if (!app.globalData.token) {
      wx.showModal({
        title: '温馨提示',
        content: '用户未登录，点击登录',
        success: (result) => {
          if (result.confirm) {
            wx.navigateTo({
              url: '/pages/login/login/login',
            })
          }
        },
      });
      return
    }
    wx.navigateTo({
      url: '../balance/balance',
    })
  },
  enteroboutUs() {
    wx.navigateTo({
      url: '/pages/my/aboutOurs/aboutOurs',
    })
  },
  enterpositionM() {
    wx.navigateTo({
      url: '/pages/index/navigation/nullPage/nullPage?content=' + 3,
    })
  },
  enterZhitumoney() {
    wx.navigateTo({
      url: '/pages/index/navigation/nullPage/nullPage?content=' + 4,
    })
  },
  entercoupons() {
    if (!app.globalData.token) {
      wx.showModal({
        title: '温馨提示',
        content: '用户未登录，点击登录',
        success: (result) => {
          if (result.confirm) {
            wx.navigateTo({
              url: '/pages/login/login/login',
            })
          }
        },
      });
      return
    }
    wx.navigateTo({
      url: '../coupons/coupons',
    })
  },
  entermyorder(e) {
    if (!app.globalData.token) {
      wx.showModal({
        title: '温馨提示',
        content: '用户未登录，点击登录',
        success: (result) => {
          if (result.confirm) {
            wx.navigateTo({
              url: '/pages/login/login/login',
            })
          }
        },
      });
      return
    }
    let type = e.currentTarget.dataset.type
    if (type) {
      wx.navigateTo({
        url: '../use-coupon/use-coupon?currentTab=' + type,
      })
    }else {
      wx.navigateTo({
        url: '../use-coupon/use-coupon',
      })
    }
  },
  enterhelpcenter() {
    wx.navigateTo({
      url: '../helpCenter/helpCenter',
    })
  },
  entersetting() {
    if (!app.globalData.token) {
      wx.showModal({
        title: '温馨提示',
        content: '用户未登录，点击登录',
        success: (result) => {
          if (result.confirm) {
            wx.navigateTo({
              url: '/pages/login/login/login',
            })
          }
        },
      });
      return
    }
    wx.navigateTo({
      url: '../seting/seting',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!app.globalData.token) {
      return
    }
    const vm = this;
    vm.setData({
      token: app.globalData.token
    })
    wx.request({
      url: app.globalData.webUrl + '/api/tenant/v1/tenant/detail?tenantId=' + app.globalData.usermessage.tenantId,
      method: 'GET',
      header: {
        'Authorization': "bearer " + app.globalData.token,
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.code === 200) {
          app.globalData.tenantList = res.data.data
          vm.setData({
            tenantList: res.data.data,
            showUnit: true
          })
        }
      },
      fail: function(res) {

      },
      complete: function(res) {

      }
    });
    wx.request({
      url: app.globalData.webUrl + '/api/report/v1/report/count?tenantId=' + app.globalData.usermessage.tenantId,
      method: 'GET',
      header: {
        'Authorization': "bearer " + app.globalData.token,
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.code === 200) {
          vm.setData({
            alreadyBackNum: res.data.data
          })
        }
      },
      fail: function(res) {

      },
      complete: function(res) {

      }
    });
    wx.request({
      url: app.globalData.webUrl + '/api/order/v1/order/statistics?tenantId=' + app.globalData.usermessage.tenantId,
      method: 'GET',
      header: {
        'Authorization': "bearer " + app.globalData.token,
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.code === 200) {
          const {
            canceledCount,
            processingCount
          } = res.data.data;
          vm.setData({
            canceledCount,
            processingCount
          })
        }

      },
      fail: function(res) {

      },
      complete: function(res) {

      }
    });
    wx.request({
      url: app.globalData.webUrl + '/api/order/v1/balance/getBalance?tenantId=' + app.globalData.usermessage.tenantId,
      method: 'GET',
      header: {
        'Authorization': "bearer " + app.globalData.token,
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.code === 200) {
          const balance = (res.data.data / 100).toFixed(2)
          vm.setData({
            balance: balance
          })

        }
      },
      fail: function(res) {

      },
      complete: function(res) {

      }
    });
    wx.request({
      url: app.globalData.webUrl + '/api/order/v1/couponRecord/count?tenantId=' + app.globalData.usermessage.tenantId,
      method: 'GET',
      header: {
        'Authorization': "bearer " + app.globalData.token,
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.code === 200) {
          vm.setData({
            couponRecord: res.data.data
          })
        }
      },
      fail: function(res) {

      },
      complete: function(res) {

      }
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
    if (!app.globalData.token) {
      return
    }
    const vm = this
    wx.request({
      url: app.globalData.webUrl + '/api/tenant/v1/tenant/detail?tenantId=' + app.globalData.usermessage.tenantId,
      method: 'GET',
      header: {
        'Authorization': "bearer " + app.globalData.token,
        'content-type': 'application/json'
      },
      success: function(res) {
        app.globalData.tenantList = res.data.data
        vm.setData({
          tenantList: res.data.data
        })
      },
      fail: function(res) {

      },
      complete: function(res) {}
    });
    this.onLoad()
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