const app = getApp();
const webUrl = app.globalData.webUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    https: app.globalData.https,
    images:app.globalData.images,
    modalOpened: false,
    modalbottom: false,
    modalbottomprint: false,
    modal: {
      header: "",
      content: "",
      buttonone: "",
      buttontwo: ""
    },
    print: {
      num: 1
    },
    num: 1,
    userList: [],
    tenantList:"",
    isSend: false
  },
  sendMessage() {
    this.setData({
      modalOpened: true,
      modal: {
        header: "更新",
        content: "确定要给候选人发送短信更新应聘表？",
        buttonone: "取消",
        buttontwo: "发送"
      }
    });
  },
  sendEmail() {
    let {tenantList}= this.data
    if (!tenantList.email) {
      wx.showModal({
        title: '温馨提示',
        content: '您还未绑定邮箱，立即跳转绑定邮箱页面',
        success: (result) => {
          
          if (result.confirm) {
            wx.navigateTo({
              url: '/pages/my/bindemail/bindemail',
            })
          }
        },
      });
      return;
    }

    this.setData({
      modalbottom: true
    })
  },
  cancelemailaddress() {
    this.setData({
      modalbottom: false
    })
  },
  sendemailaddress() {
    const vm = this;
    const { userList, isSend} = vm.data;
    if (isSend) {
      return false
    }
    vm.data.isSend = true
    wx.request({
      url: webUrl + '/api/order/v1/candidate/sendJobEmail?candidateId=' + userList.id,
      method: 'GET',
      header: {
        'Authorization': "bearer " + app.globalData.token,
      },
      success: function (res) {
        vm.data.isSend = false
        if (res.data.code === 200) {
          wx.showToast({
            icon: 'success',
            title: '已发送邮件'
          });
          vm.setData({
            modalbottom: false
          });
        }else{
          wx.showToast({
            icon:"none",
            title: res.data.msg,
          })
          vm.setData({
            modalbottom: false
          });
        }
      },
      fail: function (res) {

      },
      complete: function (res) {

      }
    });
    // this.setData({
    //   modalOpened: true,
    //   modalbottom: false,
    //   modal: {
    //     header: "发送到邮箱",
    //     content: "您没有绑定邮箱，请先去绑定",
    //     buttonone: "取消",
    //     buttontwo: "去绑定"
    //   }
    // });
  },
  printTable() {
    this.setData({
      modalbottomprint: true
    })
  },
  onModalClick() {
    const vm = this;
    const { userList } = vm.data;
    this.setData({
      modalOpened: false,
    });
    wx.request({
      url: webUrl + '/api/tenant/v1/sms/candidateUpdate',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': "bearer " + app.globalData.token,
      },
      data: {
        tenantId: app.globalData.usermessage.tenantId,
        userId: app.globalData.usermessage.userId,
        candidateId: userList.id,
        company: app.globalData.tenantList.company,
        name: userList.name,
        mobile: userList.mobile,
        email: userList.email||'',
      },
      success: function (res) {
        
        if (res.data.code === 200) {
          wx.showToast({
            type: 'success',
            title: '短信已发送!',
            duration: 3000,
            success: () => {
              return;
            },
          });
        } else {
          wx.showToast({
            type: 'fail',
            title: '发送失败！',
            duration: 3000,
            success: () => {
              return;
            },
          });
        }

      }
    });
  },
  onModalClose() {
    this.setData({
      modalOpened: false,
    });
  },
  reduce() {
    let pnum = this.data.print.num;
    pnum--;
    if (pnum < 0) {
      pnum = 0
    }
    this.setData({
      print: {
        num: pnum
      }
    })
  },
  increasenum() {
    let pnum = this.data.print.num;
    pnum++;
    this.setData({
      print: {
        num: pnum
      }
    })
  },
  cancel() {
    this.setData({
      modalbottomprint: false
    })
  },
  print() {
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      tenantList: app.globalData.tenantList
    })
    const vm = this;
    if (!options){
  return
    }
    wx.request({
      url: webUrl + '/api/order/v1/candidate/detail?candidateId=' + options.id,
      method: 'GET',
      header: {
        'Authorization': "bearer " + app.globalData.token,
      },
      success: function (res) {
       
        if (res.data.code === 200) {
          vm.setData({
            userList: res.data.data
          })
        }
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