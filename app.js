var app = getApp();
App({
  onLaunch: function() {
    wx.login({
      success: res => {
        let that = this
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: that.globalData.webUrl + '/api/tenant/v1/visit/getWXBaseInfo',
          method: 'GET',
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/json;charset=utf-8'
          },
          success: function(res) {
            if (res.data.code == 200) {
              that.globalData.openId = res.data.data.openId
              that.globalData.sessionKey = res.data.data.sessionKey
            }
          }
        })
      }
    })
    wx.checkSession({
      success: function(res) {
        //session_key未过期
      },
      fail: (res => {
        // session_key已过期
        // 进行登录操作
        wx.login({
          success: res => {
            let that = this
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.request({
              url: that.globalData.webUrl + '/api/tenant/v1/visit/getWXBaseInfo',
              method: 'GET',
              data: {
                code: res.code
              },
              header: {
                'content-type': 'application/json;charset=utf-8'
              },
              success: function(res) {
                if (res.data.code == 200) {
                  that.globalData.openId = res.data.data.openId
                  that.globalData.sessionKey = res.data.data.sessionKey
                }
              }
            })
          }
        })
      })
    })

    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    https: "http://39.98.171.198:80/wx-imgs/zhitu/imgs/",
    // webUrl: "https://api.zhitubd.com",
    webUrl: "http://api.tianyanbd.cn:8800",
    openId: "",
    sessionKey: "",
    images: "https://img.zhitubd.com/",
    // images: "http://img.tianyanbd.cn:8800/",
    token: "", //用户登录拿到的token
    candidate: "", //候选人
    candidateId: [],
    candidatemessage: "", //候选人信息
    meal: "", //套餐
    usermessage: "",
    tenantList: {}
  }
})