// pages/my/company-ok/company-ok.js
var app = getApp();
var {
  https,
  webUrl,
  images
} = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: https,
    companypicture: true,
    company: {
      companyname: "",
      companynum: "",
      companyaddress: "",
      contactName: "",
      email: ""
    },
    shoppicture: '',
    userList: "",
    tapShow: false,
    shopimg:""
  },

  // 上传营业执照
  addpicture() {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: webUrl + '/api/package/file/upload',
          name: 'file',
          filePath: tempFilePaths,
          success: (res) => {
            const list = JSON.parse(res.data)
            that.setData({
              shopimg: list.data.url,
              shoppicture: images + list.data.url,
              companypicture: false
            })
          },
        });
        // 原来的加号消失变成图片
      }
    })
  },
  submit() {
    const vm = this;
    const {
      userList,
      company
    } = vm.data;
    if (!this.data.company.companyname){
      wx.showToast({
        title: '请输入与营业执照一致的企业名称',
        icon: "none"
      })
      return
    }
    if (!this.data.company.companynum) {
      wx.showToast({
        title: '请输入统一社会信用代码',
        icon: "none"
      })
      return
    }
    let reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{18}$/
    if (!reg.test(this.data.company.companynum)) {
      wx.showToast({
        title: '请输入18位数字加字母统一社会信用代码',
        icon: "none"
      })
      return
    }
    if (!this.data.company.contactName) {
      wx.showToast({
        title: '请输入企业联系人姓名',
        icon: "none"
      })
      return
    }
    if (!this.data.company.companyaddress) {
      wx.showToast({
        title: '请输入公司办公地址',
        icon: "none"
      })
      return
    }
    if (!this.data.company.email) {
      wx.showToast({
        title: '请输入企业邮箱',
        icon: "none"
      })
      return
    }
    if (!vm.data.shoppicture) {
      wx.showToast({
        title: '营业执照不能为空',
        icon: "none"
      })
      return
    }
    wx.request({
      url: webUrl + `/api/tenant/v1/tenant/certificate`,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': "bearer " + app.globalData.token,
      },
      data: {
        id: userList.tenantId,
        company: company.companyname,
        creditCode: company.companynum,
        email: company.email,
        contactName: company.contactName,
        businessLic: vm.data.shopimg,
        address: company.companyaddress
      },
      success: function(res) {
        console.log(res)
        if (res.data.code === 200) {
          wx.showToast({
            icon: 'success',
            title: '修改成功!',
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)

        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.msg,
          });
        }
      },
      fail: function(res) {
        wx.showToast({
          icon: 'none',
          title: res.data.msg,
        });
      },
      complete: function(res) {}
    });
  },
  exmpleCompany() {
    // shoppicture: "/static/imgs/company-exmaple.png",
    // shoppicture: https + "2011_6_3_11_17_52_7259.jpg",
    this.setData({
      tapShow: true
    })
  },
  getCompanyName(e) {
    this.setData({
      company: {
        companyname: e.detail.value,
        companynum: this.data.company.companynum,
        companyaddress: this.data.company.companyaddress,
        contactName: this.data.company.contactName,
        email: this.data.company.email,
      },
    })
  },
  getCompanyNum(e) {
    this.setData({
      company: {
        companyname: this.data.company.companyname,
        companynum: e.detail.value,
        companyaddress: this.data.company.companyaddress,
        contactName: this.data.company.contactName,
        email: this.data.company.email,
      },
    })
  },
  getCompanyAddress(e) {
    this.setData({
      company: {
        companyname: this.data.company.companyname,
        companynum: this.data.company.companynum,
        companyaddress: e.detail.value,
        contactName: this.data.company.contactName,
        email: this.data.company.email,
      },
    })
  },
  getContactName(e) {
    this.setData({
      company: {
        companyname: this.data.company.companyname,
        companynum: this.data.company.companynum,
        companyaddress: this.data.company.companyaddress,
        contactName: e.detail.value,
        email: this.data.company.email,
      },
    })
  },
  getEmail(e) {
    this.setData({
      company: {
        companyname: this.data.company.companyname,
        companynum: this.data.company.companynum,
        companyaddress: this.data.company.companyaddress,
        contactName: this.data.company.contactName,
        email: e.detail.value
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.certifystatus == 3) {
      wx.setNavigationBarTitle({
        title: '重新认证'
      })
    }
    this.setData({
      userList: app.globalData.usermessage
    })
  },
  closepopUp() {
    this.setData({
      tapShow: false
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