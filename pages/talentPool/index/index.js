const app = getApp();
const webUrl = app.globalData.webUrl;
var url = app.globalData.webUrl
Page({
  data: {
    https: app.globalData.https,
    showSort: "",
    sortNum: 0,
    sortList: [{
      name: '全部',
    }, {
      name: '已背调',
    }, {
      name: '未背调'
    }],
    applicantList: [],
    pageNo: 1,
    content: "",
    total: "",
    isSurveyed: "",
    focus: false,
    tenantList: []
  },
  onLoad() {
    if (!app.globalData.token) {
      return
    }
    this.getList(this.data.pageNo)
    let that = this
    wx.request({
      url: url + '/api/tenant/v1/tenant/detail?tenantId=' + app.globalData.usermessage.tenantId,
      method: 'GET',
      header: {
        'Authorization': "bearer " + app.globalData.token,
      },
      success: function (res) {
        app.globalData.tenantList = res.data.data
        that.setData({
          tenantList: res.data.data
        })
      },
      fail: function (res) { },
      complete: function (res) { }
    });
  },
  onReachBottom: function() {
    // 页面被拉到底部
    const vm = this;
    const {
      pageNo,
      applicantList,
      total,
      isSurveyed,
      content
    } = vm.data;
    if (applicantList.length >= total) {
      wx.showToast({
        icon: "none",
        title: '已经到了最底部了！',
      })
      return;
    }
    this.setData({
      pageNo: pageNo + 1
    })
    // const num = pageNo + 1;
    wx.request({
      url: webUrl + '/api/order/v1/candidate/choose/list',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': "bearer " + app.globalData.token,
      },
      data: {
        pageNo: pageNo + 1,
        pageSize: 10,
        isSurveyed: isSurveyed,
        property: content,
      },
      success: function(res) {

        const list = [];
        applicantList.map(item => {
          list.push(item)
        })
        res.data.data.list.map(item => {
          list.push(item)
        })
        list.map(item => {
          let sex = item.name.slice(0, 1)
          item.sex = sex
        })
        vm.setData({
          applicantList: list
        })
      }
    });
  },
  focusInput() {
    this.setData({
      focus: true
    })
  },
  getList(pageNo, isSurveyed = '') {
    const vm = this;
    vm.setData({
      pageNo: 1
    })

    const {
      applicantList,
      content
    } = vm.data;

    wx.request({
      url: webUrl + '/api/order/v1/candidate/choose/list',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': "bearer " + app.globalData.token,
      },
      data: {
        pageNo: pageNo,
        pageSize: 10,
        isSurveyed: isSurveyed,
        property: content || ''
      },
      success: function(res) {
        if (res.data.code === 200) {

          if (!res.data.data.list) {
            return
          }
          res.data.data.list.map(item => {
            let sex = item.name.slice(0, 1)
            item.sex = sex
          })
          vm.setData({
            applicantList: res.data.data.list,
            total: res.data.data.total
          })

          return res.data;
        }
      }
    });
  },
  searchUser() {
    const vm = this;
    this.setData({
      pageNo: 1
    })
    const {
      pageNo,
      content,
      isSurveyed
    } = vm.data;

    wx.request({
      url: webUrl + '/api/order/v1/candidate/choose/list',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': "bearer " + app.globalData.token,
      },
      data: {
        pageNo: pageNo,
        pageSize: 10,
        property: content,
        isSurveyed: isSurveyed
      },
      success: function(res) {

        if (res.data.code === 200) {

          res.data.data.list.map(item => {
            let sex = item.name.slice(0, 1)
            item.sex = sex
          })
          vm.setData({
            applicantList: res.data.data.list
          })
        }
      }
    });
  },
  getContent(e) {
    this.setData({
      content: e.detail.value
    })
  },
  //认证状态
  certification(status, url) {
    if (status === '3') {
      wx.navigateTo({
        url: url,
      })
    } else if (status === '0') {
      wx.showModal({
        title: '温馨提示',
        content: '您还未进行企业认证，立即跳转认证页面',
        success: (result) => {
          if (result.confirm) {
            wx.navigateTo({
              url: '/pages/my/company-ok/company-ok',
            })
          }
        },
      });
    } else if (status === '1') {
      wx.showToast({
        icon: "none",
        title: "认证状态为审核中！",
        duration: 2000,
      });
    } else if (status === '2') {

      wx.showModal({
        title: '温馨提示',
        content: '企业认证失败，立即跳转认证页面',
        success: function (result) {
          if (result.confirm) {
            wx.navigateTo({
              url: '/pages/my/company-ok/company-ok',
            })
          } else if (result.cancel) {

          }
        }
      })
    }
  },
  showSort(event) {
    const vm = this;
    const {
      logo,
      i
    } = event.target.dataset;
    const {
      showSort,
      applicantList
    } = vm.data;

    if (showSort) {
      vm.setData({
        showSort: ""
      })
    } else {
      vm.setData({
        showSort: logo
      })
    }

  },
  toggleSort(event) {
    const vm = this;
    const {
      logo
    } = event.target.dataset;
    this.setData({
      pageNo: 1
    })
    vm.setData({
      sortNum: logo,
      showSort: ""
    })
    const {
      applicantList,
      pageNo
    } = vm.data;

    if (logo === 0) {
      this.getList(pageNo)
      vm.setData({
        isSurveyed: ''
      })
    } else if (logo === 1) {
      this.getList(pageNo, 1)

      vm.setData({
        isSurveyed: 1
      })
    } else if (logo === 2) {
      this.getList(pageNo, 0)

      vm.setData({
        isSurveyed: 0
      })
    }

  },
  jumpBack(e) {
    app.globalData.candidate = ""
    app.globalData.candidatemessage = ""
    app.globalData.candidateId = []
    const item = e.target.dataset.item;
    let checkedId = []
    checkedId.push(item.id)
    this.certification(this.data.tenantList.certifyStatus, `/pages/index/back-tune/back-tune?checkedvalue=${item.name}&checked=${JSON.stringify(item)}&checkedId=${JSON.stringify(checkedId)}`)
  },


  onPullDownRefresh: function() {
    setTimeout(() => {
      wx.stopPullDownRefresh
    }, 1000)
    this.setData({
      pageNo: 1,
      sortNum: 0,
      total: "",
      isSurveyed: "",
      content: ""
    })
    this.getList(this.data.pageNo)
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    if (!app.globalData.token) {
      return
    }
    this.setData({
      pageNo: 1,
      sortNum: 0
    })
    this.getList(this.data.pageNo)
  },
});