// pages/logo/forget-password/forget-password.js
var app = getApp();
var https = app.globalData.https;
var util = require("../../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: https,

    content: "",

    tel: "",
    codepicture: "",
    messagecode: "",
    gettime: false,
    counts: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.changecanvascode()
  },
  bindblurtel() {
    if (!(/^1\d{10}$/.test(this.data.tel))) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的电话号码',
      })
    } else {
    }
  },
  chancetel(e) {
    this.setData({
      tel: e.detail.value
    })
  },
  chancecodepicture(e) {
    this.setData({
      codepicture: e.detail.value
    })
  },
  chancemessagecode(e) {
    this.setData({
      messagecode: e.detail.value
    })
  },
  //图片验证码
  rn(min, max) {
    return parseInt(Math.random() * (max - min) + min);
  },
  rc(min, max) {
    var r = this.rn(min, max);
    var g = this.rn(min, max);
    var b = this.rn(min, max);
    return `rgb(${r},${g},${b})`;
  },
  draw() {
    var w = 120;
    var h = 60;
    var ctx = wx.createCanvasContext('canvas');
    ctx.fillStyle = this.rc(180, 230);
    ctx.fillRect(0, 0, w, h);
    //4.随机产生字符串
   
    for (var i = 0; i < this.data.content.length; i++) {
     
      var fs = this.rn(16, 20); //字体的大小
      var deg = this.rn(-30, 30); //字体的旋转角度
      ctx.font = fs + 'px Simhei';
      ctx.textBaseline = "top";
      ctx.fillStyle = this.rc(80, 150);
      ctx.save();
      ctx.translate(15 * i + 15, 15);
      ctx.rotate(deg * Math.PI / 180);
      ctx.fillText(this.data.content[i], -15 + 5, -5);
      ctx.restore();
    }
    //5.随机产生5条干扰线,干扰线的颜色要浅一点
    for (var i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(this.rn(0, w), this.rn(0, h));
      ctx.lineTo(this.rn(0, w), this.rn(0, h));
      ctx.strokeStyle = this.rc(180, 230);
      ctx.closePath();
      ctx.stroke();
    }
    //6.随机产生40个干扰的小点
    for (var i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.arc(this.rn(0, w), this.rn(0, h), 1, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = this.rc(150, 200);
      ctx.fill();
    }
    ctx.draw();
  },

  changecanvascode() {
    util.request(
      "GET", "/api/tenant/v1/visit/codeForMiniSys", "", this.picturecode, this.picturecodeerr)
  },
  picturecode(res) {
    this.setData({
      content: res.data,
    })
    this.draw()
  },
  picturecodeerr() {},
  nexttep() {
    let tel = this.data.tel;
    let codepicture = this.data.codepicture;
    let messagecode = this.data.messagecode;
    if (!tel) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    }
    if (!codepicture) {
      wx.showToast({
        title: '请输入图形验证码',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    }
    if (!messagecode) {
      wx.showToast({
        title: '请输入短信验证码',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    }
    util.request(
      "POST", "/api/tenant/v1/retrievePassword/login/findLoginPwd", {
        "mobile": this.data.tel,
        "smsCode": this.data.messagecode
      }, this.getencryptKeycallback, this.getencryptKeyerrFun)

  },
  getencryptKeycallback(res) {
    
    if (res.code == 200) {
      wx.navigateTo({
        url: '../set-password/set-password?tel=' + this.data.tel + '&messagecode=' + this.data.messagecode + '&encryptKey=' + res.data,
      })
    } else {
      wx.showModal({
        title: '提示',
        content: res.msg,
      })
    }
  },
  getencryptKeyerrFun() {},
  getcode() {
    let that = this
    if (this.isLock) {
      return false
    }
    this.isLock = true
    util.request(
      "POST", "/api/tenant/v1/retrievePassword/login/sendSmsCodeWithImageCode", {
        "mobile": that.data.tel,
        "imageCode": that.data.codepicture
      }, that.getcodecallback, that.getcodeerrFun)
  },
  getcodecallback(res) {
    
    let that =this
    if (res.code == 200) {
      wx.showToast({
        title: '已发送验证码',
        icon: 'succes',
        duration: 1000,
        mask: true
      })
      that.setData({
        counts: 60
      });
      let getsix = setInterval(function () {
        if (that.data.counts < 2) {
          clearInterval(getsix);
          that.setData({
            gettime: false,
          });
        }
        var times = that.data.counts - 1
        console.log(times)
        that.setData({
          counts: times,
          gettime: true
        })
      }, 1000)
    } else {
      wx.showModal({
        title: '提示',
        content: res.msg,
      })
    }
    this.isLock = false
  },
  getcodeerrFun() {},
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