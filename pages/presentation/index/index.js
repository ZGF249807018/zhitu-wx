const app = getApp();
const webUrl = app.globalData.webUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    https: app.globalData.https,
    applicantList: [],
    pageNo: 1,
    content: "",
    total: "",
    modalOpened: false,
    focus: false,
    isFinish: 0,
    statusList: [{
        time: "2018-12-03 12:01:45",
        num: 1,
        status: "下单"
      },
      {
        time: "2018-12-03 12:01:45",
        num: 2,
        status: "已支付"
      },
      {
        time: "2018-12-03 12:01:45",
        num: 3,
        status: "已授权"
      }
      // ,
      // {
      //   time: "2018-12-03 12:01:45",
      //   num: 4,
      //   status: "检验中"
      // }
      // ,
      // {
      //   time: "2018-12-03 12:01:45",
      //   num: 5,
      //   status: "完成报告"
      // },
    ],
    finishstatus: {
      time: "2018-12-03 12:01:45",
      num: 5,
      status: "完成报告"
    },
    checkstatus: {
      time: "",
      num: 4,
      status: "核验中"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!app.globalData.token) {
      return
    }
    const vm = this;
    const {
      applicantList
    } = vm.data;
    applicantList.map(item => {
      let sex = item.name.slice(0, 1)
      item.sex = sex
    })
    vm.setData({
      applicantList: applicantList
    })
    this.getList(this.data.pageNo)
  },

  //获取报告列表人才库数据
  getList(pageNo) {
    const vm = this;
    const {
      applicantList
    } = vm.data;
 
    wx.request({
      url: webUrl + '/api/order/v1/order/list/wx?searchKey=' + "" + '&pageSize=10&pageNum=' + pageNo,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': "bearer " + app.globalData.token,
      },
      success: function(res) {
        if (res.data.code === 200) {
          if (!res.data.data.list) {
            return
          }
          res.data.data.list.map(item => {
           
            if (item.status === 1) {
              item.status = "已支付"
            } else if (item.status === 2) {
              item.status = "核验中"
            } else if (item.status === 3) {
              item.status = "已完成"
            }
            let sex = item.candidateName.slice(0, 1)
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
  getContent(e) {
    this.setData({
      content: e.detail.value
    })
  },
  searchUser() {
    const vm = this;
    this.setData({
      pageNo:1
    })
    const {
      pageNo,
      content
    } = vm.data;
    wx.request({
      url: webUrl + '/api/order/v1/order/list/wx?searchKey=' + content + '&pageSize=10&pageNum=' + pageNo,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': "bearer " + app.globalData.token,
      },
      success: function(res) {
        if (res.data.code === 200) {
         
          if (res.data.data.list == null) {
            res.data.data.list = []
          }
          res.data.data.list.map(item => {
           
            if (item.status === 1) {
              item.status = "已支付"
            } else if (item.status === 2) {
              item.status = "核验中"
            } else if (item.status === 3) {
              item.status = "已完成"
            }
            let sex = item.candidateName.slice(0, 1)
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
  focusInput() {
    this.setData({
      focus: true
    })
  },
  //点击查看状态值
  openStatus(e) {
    let that = this
   
    wx.request({
      url: webUrl + '/api/report/v1/report/getProcessTime?orderNo=' + e.currentTarget.dataset.orderno,
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': "bearer " + app.globalData.token,
      },
      success: function(res) {
        if (res.data.code == 200) {
          let time = res.data.data
          console.log(time)
          if (time.isFinish == 1) {
            that.setData({
              isFinish: 0
            })
          } else {
            that.setData({
              isFinish: 1
            })
          }
          
          that.setData({

            statusList: [{
                time: time.orderCreateTime,
                num: 1,
                status: "下单"
              },
              {
                time: time.payTime,
                num: 2,
                status: "已支付",
              },
              {
                time: time.authorizedTime,
                num: 3,
                status: "已授权"
              }
            ],
            finishstatus: {
              time: res.data.data.finish,
              num: 5,
              status: "完成报告"
            }
          })

        }
        that.setData({
          modalOpened: true,
        });
      }
    })

  },
  onModalClose() {
    this.setData({
      modalOpened: false,
    });
  },
  //查看报告
  defaultTap(e) {
    if (e.target.dataset.orderno.status != '已完成') {
      wx.showToast({
        title: '该报告未完成',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '/pages/report/report?orderno=' + e.target.dataset.orderno.orderNo,
      })
    }
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
    if (!app.globalData.token) {
      return
    }
    this.setData({
      pageNo:1
    })
    this.getList(this.data.pageNo)
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
    // 页面被拉到底部
    const vm = this;
    const {
      pageNo,
      applicantList,
      total,
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
    const num = pageNo + 1;
    wx.request({
      url: webUrl + '/api/order/v1/order/list/wx?searchKey=' + content + '&pageSize=10&pageNum=' + num,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': "bearer " + app.globalData.token,
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
          if (item.status === 1) {
            item.status = "已支付"
          } else if (item.status === 2) {
            item.status = "核验中"
          } else if (item.status === 3) {
            item.status = "已完成"
          }
          let sex = item.candidateName.slice(0, 1)
          item.sex = sex
        })
        vm.setData({
          applicantList: list
        })
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})