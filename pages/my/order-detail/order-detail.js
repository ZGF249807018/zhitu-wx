// pages/my/order-detail/order-detail.js
var app = getApp();
var https = app.globalData.https
const webUrl = app.globalData.webUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: https,
    orderdetail: "",
    basicmessage: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let orderNo = options.orderNo
    this.getorderdetail(orderNo)
  },
  // 获取订单详情
  getorderdetail(orderNo) {
    let that = this
    let usermessage = app.globalData.usermessage
    wx.request({
      url: webUrl + '/api/order/v1/order/detail',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': "bearer " + app.globalData.token,
      },
      data: {
        "tenantId": usermessage.tenantId,
        "orderNo": orderNo
      },
      success: function(res) {
        if (res.data.code === 200) {
          that.setData({
            orderdetail: res.data.data
          })
          let coupons
          if (res.data.data.couponConcessions === 0) {
            coupons = " "
          } else {
            coupons = (res.data.data.couponConcessions/100).toFixed(2) + ':' + res.data.data.couponRecordName
          }
          that.setData({
            basicmessage: [{
                jobs: "候选人",
                name: res.data.data.candidateInfo.name || " ",
                tel: res.data.data.candidateInfo.mobile || " ",
                position: res.data.data.candidateInfo.position || " "
              },
              {
                jobs: "订单编号",
                name: res.data.data.orderNo,
                tel: "",
                position: ""
              },
              {
                jobs: "下单时间",
                name: res.data.data.createDate,
                tel: "",
                position: ""
              },
              {
                jobs: "支付方式",
                name: res.data.data.payType || " ",
                tel: "",
                position: ""
              },
              {
                jobs: "优惠券",
                name: coupons ? coupons: ('￥' +  coupons),
                tel: "",
                position: ""
              },
              {
                jobs: "职兔币抵扣",
                name: "0",
                tel: "",
                position: ""
              },
              {
                jobs: "订单价格",
                name: (res.data.data.price / 100).toFixed(2) ? '￥' + (res.data.data.price / 100).toFixed(2) : " ",
                tel: "",
                position: ""
              },
              {
                jobs: "实付款",
                name: '￥' + (res.data.data.actualPay / 100).toFixed(2),
                tel: "",
                position: ""
              },

            ]
          })
        }
      }
    })
  },
  orderpay(e) {
    app.globalData.candidate = ""
    app.globalData.candidatemessage = ""
    app.globalData.meal = ""
    let content = e.currentTarget.dataset.content
    let checkedvalue = content.candidateName
    let newcheckvalueId = []
    let meal = {
      "id": content.packageInfo.id,
      "name": content.packageInfo.name,
      "description": content.packageInfo.description,
      "price": (content.packageInfo.price / 100).toFixed(2) || 0,
      "childCount": content.packageInfo.childCount || 0
    }
    let checked = {
      "id": content.candidateId,
      "name": content.candidateName,
      "mobile": content.mobile
    }
    newcheckvalueId.push(content.candidateId)
    wx.navigateTo({
      url: '/pages/index/back-tune/back-tune?checkedvalue=' + checkedvalue + '&meal=' + JSON.stringify(meal) + '&checked=' + JSON.stringify(checked) + '&checkedId=' + JSON.stringify(newcheckvalueId) + '&myOrder=' + JSON.stringify(e.currentTarget.dataset.content),
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