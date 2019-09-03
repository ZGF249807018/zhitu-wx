var dateTimePicker = require('../../../../utils/dateTimePicker.js');
const app = getApp();
const urls = app.globalData.webUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    https: app.globalData.https,
    modalOpened: true,
    name: '',
    phone: '',
    email: '',
    dateTime: '',
    address: '',
    contacts: '',
    contactsPhone: '',
    times: '',
    company: "",
    dateTimeArray: "",
    dateTimeTitle: false,
    isSend: false
  },
  openModal() {
    const vm = this;
    const dataTimes = this.data.dateTimeArray[0][this.data.dateTime[0]] + '-' +
      this.data.dateTimeArray[1][this.data.dateTime[1]] + '-' +
      this.data.dateTimeArray[2][this.data.dateTime[2]] + ' ' +
      this.data.dateTimeArray[3][this.data.dateTime[3]] + ':' +
      this.data.dateTimeArray[4][this.data.dateTime[4]]

    const {
      name,
      phone,
      email,
      address,
      contacts,
      contactsPhone
    } = vm.data
    if (
      name &&
      phone &&
      dataTimes &&
      address &&
      contacts &&
      contactsPhone
    ) {
      if (
        (!(/^1\d{10}$/.test(phone)))
      ) {
        wx.showToast({
          icon: "none",
          title: '手机号格式不正确，请重新输入'
        });
        return;
      }
      if (!(/^1\d{10}$/.test(contactsPhone))) {
        wx.showToast({
          icon: "none",
          title: '手机号格式不正确，请重新输入'
        });
        return;
      }
      vm.setData({
        modalOpened: false,
      });
    } else {
      wx.showToast({
        icon: "none",
        title: '信息未填写完整，请继续输入'
      });
    }
  },
  onModalClick(e) {
    this.setData({
      modalOpened: true,
    });
  },
  onModalClose() {
    this.setData({
      modalOpened: true,
    });
  },
  getName(event) {
    this.setData({
      name: event.detail.value
    })
  },
  getPhone(event) {
    this.setData({
      phone: event.detail.value
    })
  },
  getEmail(event) {
    this.setData({
      email: event.detail.value
    })
  },
  getAddress(event) {
    this.setData({
      address: event.detail.value
    })
  },
  getContacts(event) {
    this.setData({
      contacts: event.detail.value
    })
  },
  getContactsPhone(event) {
    this.setData({
      contactsPhone: event.detail.value
    })
  },
  getTime(e) {
    const vm = this;
    this.setData({
      dateTime: e.detail.value,
      dateTimeTitle: true
    });
  },
  getTimes(e) {
    var arr = this.data.dateTime,
      dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr,
      dateTimeTitle: true
    });
  },
  send() {
    const dataTimes = this.data.dateTimeArray[0][this.data.dateTime[0]] + '-' +
      this.data.dateTimeArray[1][this.data.dateTime[1]] + '-' +
      this.data.dateTimeArray[2][this.data.dateTime[2]] + ' ' +
      this.data.dateTimeArray[3][this.data.dateTime[3]] + ':' +
      this.data.dateTimeArray[4][this.data.dateTime[4]]

    const vm = this;
    const {
      name,
      phone,
      email,
      dateTime,
      address,
      contacts,
      contactsPhone,
      isSend
    } = vm.data
    if (
      name &&
      phone &&
      dataTimes &&
      address &&
      contacts &&
      contactsPhone
    ) {
      if (!(/^1\d{10}$/.test(phone))) {
        wx.showToast({
          icon: "none",
          title: '手机号格式不正确，请重新输入'
        });
        return;
      }
      if (!(/^1\d{10}$/.test(contactsPhone))) {
        wx.showToast({
          icon: "none",
          title: '手机号格式不正确，请重新输入'
        });
        return;
      }
      var re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if ((!re.test(email)) && email) {
        wx.showToast({
          icon: "none",
          title: "邮箱格式不正确，请重新输入！"
        })
        return;
      }
      if (phone == contactsPhone) {
        wx.showToast({
          icon: "none",
          title: '联系方式不能与候选人电话相同'

        })
        return;
      }
      console.log(isSend)
      if (isSend){
        return false
      }
      vm.setData({
        isSend: true
      })
      wx.request({
        url: urls + '/api/tenant/v1/sms/sendInterview',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'authorization': "bearer " + app.globalData.token
        },
        data: {
          name: name,
          mobile: phone,
          email: email || '',
          interviewTime: dataTimes,
          address: address,
          contacts: contacts,
          phone: contactsPhone,
        },
        success: function(res) {
          vm.setData({
            isSend: false
          })
          if (res.data.code === 200) {
            wx.showToast({
              title: '发送成功！'
            })
            wx.switchTab({
              url: "/pages/index/index/index"
            })
            // setTimeout(() => {
            //   wx.switchTab({
            //     url: "/pages/index/index/index"
            //   })
            // }, 1000)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            })
          }
        }
      });
    } else {
      wx.showToast({
        icon: "none",
        title: '信息未填写完整，请继续输入'
      });
      vm.setData({
        isSend: false
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      company: app.globalData.usermessage.company
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