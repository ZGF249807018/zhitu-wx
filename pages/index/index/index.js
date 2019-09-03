var app = getApp();
var https = app.globalData.https
var url = app.globalData.webUrl


Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: "",
    i: [],
    imageUrl: https,
    title: '你好小程序',
    background: ['color1', 'color2', 'color3'],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 500,
    mealItems: [],
    tenantList: ""
  },
  // 获取获取所有的固定套餐
  getallfixedList() {
    // let token = app.globalData.token
    let that = this
    wx.request({
      url: url + '/api/package/v1/pkg/fixedList',
      method: "GET",
      header: {
        "Content-Type": "application/json" ,
        // 'Authorization': "bearer " + token,
      },
      success: function(res) {
        if (res.data.code == 200) {
          let mealItems = res.data.data
          for (let i = 0; i < mealItems.length; i++) {
            mealItems[i].price = (mealItems[i].price / 100).toFixed(2)
            if (mealItems[i].name == "极速版A") {
              mealItems[i].name = https + "topspeed-icon-A.png"
            } else if (mealItems[i].name == "极速版B") {
              mealItems[i].name = https + "topspeed-icon-B.png"
            } else if (mealItems[i].name == "标准版") {
              mealItems[i].name = https + "standard-icon.png"
            } else if (mealItems[i].name == "深度版") {
              mealItems[i].name = https + "depth-icon.png"
            }
            mealItems[i].description = mealItems[i].description.split('  ').join(' | ')
          }
          that.setData({
            mealItems: mealItems
          })
        }
      }
    })
  },
  enterreport() {
    wx.navigateTo({
      url: '/pages/report/report?exmple=' + 1,
    })
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
        success: function(result) {
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
  enterblock() {
    wx.navigateTo({
      url: '/pages/index/navigation/backResult/backResult',
    })
  },
  openDesc(e) {
    const vm = this;
    const {
      i,
      mealItems
    } = vm.data;

    if (i[e.currentTarget.dataset.i] && i[e.currentTarget.dataset.i] === e.currentTarget.dataset.i || i[e.currentTarget.dataset.i] === 0) {
      i[e.currentTarget.dataset.i] = ""
      vm.setData({
        i: i
      })
    } else {
      i[e.currentTarget.dataset.i] = e.currentTarget.dataset.i
      vm.setData({
        i: i
      })
    }
  },
  enterbacktunes() {
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
    app.globalData.candidatemessage = ""
    app.globalData.candidate = ""
    app.globalData.candidateId = []
    app.globalData.meal = ""
    this.certification(this.data.tenantList.certifyStatus, '../back-tune/back-tune')
  },
  enterbacktune(e) {
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
    let meallist = e.currentTarget.dataset.meal
    if (meallist.name == https + "topspeed-icon-A.png") {
      meallist.name = "极速版A"
    } else if (meallist.name == https + "topspeed-icon-B.png") {
      meallist.name = "极速版B"
    } else if (meallist.name == https + "standard-icon.png") {
      meallist.name = "标准版"
    } else if (meallist.name == https + "depth-icon.png") {
      meallist.name = "深度版"
    }
    this.certification(this.data.tenantList.certifyStatus, '../back-tune/back-tune?meal=' + JSON.stringify(meallist))
  },
  enterpostInvite() {
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
    this.certification(this.data.tenantList.certifyStatus, '/pages/index/navigation/postInvite/postInvite')
  },
  enterjobWantedTable() {
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
    this.certification(this.data.tenantList.certifyStatus, '/pages/index/navigation/jobWantedTable/jobWantedTable')
  },
  enterRegistration() {
    wx.navigateTo({
      url: '../../login/registration/registration',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const vm = this;
    const {
      i,
      mealItems
    } = vm.data;
    for (let z = 0; z < mealItems.length; z++) {
      i[z] = ""
    }
    vm.setData({
      i: i,

      tenantList: app.globalData.tenantList
    })
    this.getallfixedList()
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
    let that = this
    that.setData({
      token: app.globalData.token,
    })
    wx.request({
      url: url + '/api/tenant/v1/tenant/detail?tenantId=' + app.globalData.usermessage.tenantId,
      method: 'GET',
      header: {
        'Authorization': "bearer " + app.globalData.token,
      },
      success: function(res) {
        app.globalData.tenantList = res.data.data
        that.setData({
          tenantList: res.data.data
        })
      },
      fail: function(res) {},
      complete: function(res) {}
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