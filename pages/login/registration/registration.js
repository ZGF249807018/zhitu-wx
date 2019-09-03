var app = getApp();
var url = app.globalData.webUrl
var util = require("../../../utils/request.js")
// var util = require("../../../utils/password.js")
var https = app.globalData.https

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: https,
    text: '',
    image: "",
    content: "",
    iphone: "",
    imgcode: "",
    messagecode: "",
    gettime: false,
    counts: 0
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.changecanvascode()

    // var that = this;
    // util.drawPic(that);
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
  // 输入完手机号光标切换触发
  bindblurtel(e) {
    
    this.setData({
      iphone: e.detail.value
    })
    if (this.data.iphone == '') {
      wx.showToast({
        title: '请输入电话号码',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }

    if (!(/^1[345789]\d{9}$/.test(this.data.iphone))) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的电话号码',
      })
      return
    }

    util.request(
      "GET", "/api/tenant/v1/visit/mobileIsExisted", {
        "mobile": this.data.iphone
      }, this.telcallback, this.telerrFun)


  },
  telcallback(res) {
    if (res.msg === "电话号码有误") {
      wx.showToast({
        title: '电话号码有误',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else if (res.msg === "") {}
  },
  telerrFun() {

  },
  // iphone手机号码
  watchPhone(e) {

    this.setData({
      iphone: e.detail.value
    })
  },
  // imgcode图片数字
  watchimgcode(e) {
    
    this.setData({
      imgcode: e.detail.value
    })
  },
  // 获取验证码
  getcode(e) {
    
    if (this.isLock) {
      return false
    }
    this.isLock = true
    let that = this
    if (this.data.iphone == '') {
      wx.showToast({
        title: '请输入电话号码',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }
    if (!(/^1[345789]\d{9}$/.test(this.data.iphone))) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的电话号码',
      })
      return
    }
    if (this.data.imgcode == '') {
      wx.showToast({
        title: '请输入图形验证码',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }


    util.request(
      "POST", "/api/tenant/v1/visit/sendImgCode", {
        "mobile": this.data.iphone,
        "imageCode": this.data.imgcode,
        "bizType": "register_code" //固定值
      }, this.callback, this.errFun)
  },
  callback(res) {
    
    let that = this
    if (res.code == 200) {
      wx.showToast({
        title: '发送验证码成功',
        icon: "success"
      })
      that.setData({
        counts: 60
      });
      let getsix = setInterval(function() {
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
      wx.showToast({
        title: res.msg,
        icon: "none"
      })
    }
    this.isLock = false
  },
  errFun(err) {
    
  },
  // 实时获取短信验证码
  watchmessagecode(e) {
    this.setData({
      messagecode: e.detail.value
    })
  },

  // 下一步
  nexttap() {
    if (!this.data.iphone) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    }
    console.log(this.data.iphone)
    if (!this.data.imgcode) {
      wx.showToast({
        title: '请输入图形验证码',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    }
    if (!this.data.messagecode) {
      wx.showToast({
        title: '请输入短信验证码',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    }
    util.request(
      "POST", "/api/tenant/v1/visit/registStepOne", {
        "mobile": this.data.iphone,
        "smsCode": this.data.messagecode
      }, this.nextcallback, this.nexterrFun)
  },
  nextcallback(res) {
    
    if (res.code == 200) {
      if (res.data == this.data.iphone) {
        wx.navigateTo({
          url: '../registration-perfect/registration-perfect?mobile=' + this.data.iphone,
        })
      }
    } else {
      wx.showToast({
        title: res.msg,
        icon: "none"
      })
    }

  },
  nexterrFun() {},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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