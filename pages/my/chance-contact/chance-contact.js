// pages/my/chance-contact/chance-contact.js
var app = getApp();
var { https, webUrl, } = app.globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: https,
    err:false,
    inputcontent: "",
    userList: "",
    token: ""
  },
  watchcontact(event){
    if (event.detail.value){
      this.setData({
        err: true,
        inputcontent: event.detail.value
      })
    }else{
      this.setData({
        err: false
      })
    }
  },
  clearcontent() {
    this.setData({
      inputcontent: "",
      err: false
    })
  },
  submit() {
    const vm = this;
    const { inputcontent, userList, token } = vm.data;
    wx.request({
      url: webUrl + `/api/tenant/v1/tenant/updateContractName?tenantId=${userList.tenantId}&contractName=${inputcontent}`,
      method: 'GET',
      header: {
        'Authorization': "bearer " +  token,
      },
      success: function (res) {
        if (res.data.code === 200) {
          wx.showToast({
            icon: 'success',
            title: '修改成功',
          });
          
          wx.navigateBack({
            delta: 1
          })
        }
      },
      fail: function (res) {

      },
      complete: function (res) {
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
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