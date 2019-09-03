// pages/my/basicmessage/basicmessage.js
var app = getApp();
const { https,images ,webUrl } = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: https,
    company:{
      userImg: https+"Default-avatar.png"
    },
    tenantList: "",
    images: app.globalData.images,
    userList: {}
  },
  getUserList(tenantId, token) {
    const vm = this;
    wx.request({
      url: webUrl + '/api/tenant/v1/tenant/detail?tenantId=' + tenantId,
      method: 'GET',
      header: {
        'Authorization': "bearer " +  token,
      },
      success: function (res) {
        if (res.data.code === 200) {
          // wx.showToast({
          //   icon: "none",
          //   title: '更新成功',
          // })
          app.globalData.tenantList = res.data.data
          vm.setData({
            tenantList: res.data.data
          })
        }
      },
      fail: function (res) {

      },
      complete: function (res) {
 
      }
    });
  },
  selectpicture(){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0];
        wx.uploadFile({
          url: webUrl + '/api/package/file/upload',
          name: 'file',
          filePath: tempFilePaths,
          success: (res) => {
            const list = JSON.parse(res.data)
            that.setData({
              company: {
                userImg: images + list.data.url
              }
            })
            wx.request({
              url: webUrl + '/api/tenant/v1/tenant/updateLogo',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': "bearer " +  app.globalData.token,
              },
              data: {
                logo: list.data.url,
                id: app.globalData.usermessage.tenantId
              },
              success: function (res) {
                if (res.data.code === 200) {
                  that.getUserList(app.globalData.usermessage.tenantId, app.globalData.token)
                } else {
                  wx.showToast({
                    icon: "none",
                    title: res.data.msg,
                  })
                }
                
              },
              fail: function (res) {
              },
              complete: function (res) {
    
              }
            });
          },
        });

      }
    })
  },
  // 修改联系人
  chancepeople() {
    wx.navigateTo({
      url: '../chance-contact/chance-contact'
    })
  },
  // 修改联系方式
  chancetel(){
    wx.navigateTo({
      url: '../chance-phone/chance-phone'
    })
  },
  //修改邮箱
  chanceemail() {
    
    if (this.data.tenantList.email){
      wx.navigateTo({
        url: '../chance-email/chance-email'
      })
     
    }else{
      wx.navigateTo({
        url: '../bindemail/bindemail',
      })
    }
  },
  // 企业认证
  certification(e) {
 
    wx.navigateTo({
      url: '../company-ok/company-ok?certifystatus=' + e.currentTarget.dataset.certifystatus
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userList: app.globalData.tenantList
    })
    this.getUserList(app.globalData.usermessage.tenantId, app.globalData.token)
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
    this.getUserList(app.globalData.usermessage.tenantId, app.globalData.token)
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