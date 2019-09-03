// pages/logo/registration-perfect/registration-perfect.js
var app = getApp();
var https = app.globalData.https;
var util = require("../../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: https,


    modal: false,


    companyname: "",
    username: "",
    password: "",
    passwordagin: "",
    countcode: "",
    mobile: "",

    eye: {
      passwords: "",
      passwordshow: "password",
      img: {
        closeeye: https + 'invisible.png'
      }
    },
    eyes: {
      passwords: "",
      passwordshow: "password",
      img: {
        closeeye: https + 'invisible.png'
      }
    },
    companynameif: true,
    usernameif: false,
    knowChecked: true
  },
  //实时监听公司名称
  watchcompanyname(e) {
    this.setData({
      companyname: e.detail.value
    })
  },
  // 失去焦点调用
  blurcompanyname() {
    util.request(
      "GET", "/api/tenant/v1/visit/companyIsExisted", {
        "company": this.data.companyname
      }, this.companynamecallback, this.companynameerrFun)
  },
  enterAgreement(){
    wx.navigateTo({
      url: '../agreement/agreement',
    })
  },
  companynamecallback(res) {
   
    let that = this
    if (this.data.companyname == "") {
      wx.showToast({
        title: '请输入公司名',
        icon: "none"
      })
      this.setData({
        companynameif: false
      })
    } else {
      if (res.data) {
        wx.showToast({
          title: '公司已存在',
          icon: "none"
        })
        this.setData({
          companynameif: false
        })
      } else {
        this.setData({
          companynameif: true
        })
      }
    }

  },
  companynameerrFun() {},
  //实时监听用户名
  watchusername(e) {
    this.setData({
      username: e.detail.value
    })
  },
  blurusername() {
    util.request(
      "GET", "/api/tenant/v1/visit/accountIsExisted", {
        "account": this.data.username
      }, this.usernamecallback, this.usernameerrFun)
  },
  usernamecallback(res) {
    
    let that = this
    if (/.*[\u4e00-\u9fa5]+.*$/.test(this.data.username)) {
      
      wx.showToast({
        title: '用户名不能有中文 ',
        icon:"none"
      })
      return false;
    }
    if (this.data.username == "") {
      wx.showToast({
        title: '请输入用户名',
        icon: "none"
      })
      this.setData({
        usernameif: false
      })
    } else {
      if (res.data) {
        wx.showToast({
          title: '用户名已存在',
          icon: "none"
        })
        this.setData({
          usernameif: false
        })
      } else {
        this.setData({
          usernameif: true
        })
      }
    }
  },
  usernameerrFun() {},
  //实时监听密码
  watchpassword(e) {
    this.setData({
      password: e.detail.value
    })
    
  },
  //实时监听确认密码
  watchpasswordagin(e) {

    this.setData({
      eyes: {
        passwords: e.detail.value,
        passwordshow: this.data.eyes.passwordshow,
        img: {
          closeeye: this.data.eyes.img.closeeye
        }
      },
      passwordagin: e.detail.value
    })
   
  },
  // 点击眼睛
  showpasswordone() {
    if (this.data.eye.passwordshow == "password") {
      this.setData({
        eye: {
          passwords: this.data.eye.passwords,
          passwordshow: "text",
          img: {
            closeeye: https + 'so.png',
          }
        }
      })
    } else {
      this.setData({
        eye: {
          passwords: this.data.eye.passwords,
          passwordshow: "password",
          img: {
            closeeye: https + 'invisible.png',
          }
        }
      })
    }
  },
  showpassword() {
    if (this.data.eyes.passwordshow == "password") {
      this.setData({
        eyes: {
          passwords: this.data.eyes.passwords,
          passwordshow: "text",
          img: {
            closeeye: https + 'so.png',
          }
        }
      })
    } else {
      this.setData({
        eyes: {
          passwords: this.data.eyes.passwords,
          passwordshow: "password",
          img: {
            closeeye: https + 'invisible.png',
          }
        }
      })
    }
  },

  //实时监听优惠码
  watchcountcode(e) {
    this.setData({
      countcode: e.detail.value
    })
    
  },
  checkboxChange(e) {
    this.setData({
      knowChecked: !this.data.knowChecked
    })
    // this.setData({
    //   knowChecked:
    //   })
  },
  //注册
  registered() {
    if (!this.data.companynameif) {
      wx.showToast({
        title: '公司已存在',
        icon: "none"
      })
      return
    }
    if (!this.data.usernameif) {
      wx.showToast({
        title: '用户名已存在',
        icon: "none"
      })
      return
    }
    if (!this.data.username) {
      wx.showToast({
        title: '用户名不能为空',
        icon: "none"
      })
      return
    }
    if (/.*[\u4e00-\u9fa5]+.*$/.test(this.data.username)) {
     
      wx.showToast({
        title: '用户名不能有中文 ',
        icon: "none"
      })
      return false;
    }
    if (!this.data.knowChecked) {
      wx.showToast({
        title: '打钩职兔协议',
        icon: "none"
      })
      return
    }
    let that = this;
    let password = this.data.password
    let passwordagin = this.data.passwordagin
    if (!that.data.password) {
      wx.showToast({
        title: '请输入密码!',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return true
    }
    if (!that.data.passwordagin) {
      wx.showToast({
        title: '请二次确认密码!',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return true
    }
    if (password !== passwordagin) {
      wx.showToast({
        title: '两次填写的密码不一致',
        icon: "none"
      })
    } else {

      let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
      if (!reg.test(that.data.password)) {
        wx.showModal({
          title: '提示',
          content: '请输入6-20位数字和字母组成的密码',
        })
        return
      }

      util.request(
        "POST", "/api/tenant/v1/visit/register", {
          "mobile": that.data.mobile,
          "account": that.data.username,
          "password": password,
          "company": that.data.companyname,
          "inviteCode": that.data.countcode
        }, that.registeredcallback, that.registerederrFun)

    }
  },
  registeredcallback(res) {
    let that = this
    if (res.code == 200) {
      wx.showToast({
        title: '注册成功',
        icon: "success"
      })
      wx.navigateBack({
        delta: 2
      })
    } else {
      wx.showToast({
        title: res.msg,
        icon: "none"
      })
    }
  },
  registerederrFun() {},
  //登录
  login() {
    wx.redirectTo({
      url: '../login-phone/login-phone'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      mobile: options.mobile
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