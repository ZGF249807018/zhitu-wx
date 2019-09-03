const app = getApp();
var https = app.globalData.https
const webUrl = app.globalData.webUrl;
var time = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    clientheight: 0,
    pageNum: 1,

    height: 0,
    nopayheight: 0,
    nopaytotal: "",
    waitauthheight: 0,
    waitauthtotal: "",
    authedheight: 0,
    authedtotal: "",
    paidheight: 0,
    paidtotal: "",
    cancelpayheight: 0,
    cancelpaytotal: "",

    pay: {
      nopay: [],
      waitauth: [],
      authed: [],
      paid: [],
      cancelpay: [],
    }
  },
  enterorderdetail(e) {
    wx.navigateTo({
      url: '../order-detail/order-detail?orderNo=' + e.currentTarget.dataset.content,
    })
  },
  //获取订单详情
  getorderdetail(num) {
    let that = this
    let usermessage = app.globalData.usermessage
    wx.request({
      url: webUrl + '/api/order/v1/order/list',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': "bearer " + app.globalData.token,
      },
      data: {
        "tenantId": usermessage.tenantId,
        "status": num,
        "pageSize": 10, //每页条数
        "pageNum": that.data.pageNum //页数
      },
      success: function(res) {
     

        let datahight = 0
        let fixedheight = 0
        if (res.data.code == 200) {
          let listdata = res.data.data.list
          
          if (listdata) {
            listdata.map((item) => {
             
              item.actualPay = (item.actualPay / 100).toFixed(2)
              item.price = (item.price / 100).toFixed(2)
            })
          }

          if (res.data.data.list) {
            datahight = 370 * res.data.data.list.length;
            fixedheight = 370 * res.data.data.list.length
          }
          if (datahight < that.data.height) {
            datahight = that.data.height
          }
          if (num === 0) {
            if (res.data.data.list) {
              that.setData({
                nopayheight: fixedheight,
                height: datahight,
                nopaytotal: res.data.data.total,
                pay: {
                  nopay: that.data.pay.nopay.concat(res.data.data.list),
                  waitauth: that.data.pay.waitauth,
                  authed: that.data.pay.authed,
                  paid: that.data.pay.paid,
                  cancelpay: that.data.pay.cancelpay
                }
              })
              that.setData({
                height: that.data.pay.nopay.length * 370
              })
            }
          } else if (num === 1) {
            if (res.data.data.list) {
              that.setData({
                waitauthheight: fixedheight,
                height: datahight,
                waitauthtotal: res.data.data.total,
                pay: {
                  nopay: that.data.pay.nopay,
                  waitauth: that.data.pay.waitauth.concat(res.data.data.list),
                  authed: that.data.pay.authed,
                  paid: that.data.pay.paid,
                  cancelpay: that.data.pay.cancelpay
                }
              })

              that.setData({
                height: that.data.pay.waitauth.length * 370
              })
            }
          } else if (num === 2) {
            if (res.data.data.list) {
              that.setData({
                authedheight: fixedheight,
                height: datahight,
                authedtotal: res.data.data.total,
                pay: {
                  nopay: that.data.pay.nopay,
                  waitauth: that.data.pay.waitauth,
                  authed: that.data.pay.authed.concat(res.data.data.list),
                  paid: that.data.pay.paid,
                  cancelpay: that.data.pay.cancelpay
                }
              })
              that.setData({
                height: that.data.pay.authed.length * 370
              })
            }
          } else if (num === 3) {
            if (res.data.data.list) {
              that.setData({
                paidheight: fixedheight,
                height: datahight,
                paidtotal: res.data.data.total,
                pay: {
                  nopay: that.data.pay.nopay,
                  waitauth: that.data.pay.waitauth,
                  authed: that.data.pay.authed,
                  paid: that.data.pay.paid.concat(res.data.data.list),
                  cancelpay: that.data.pay.cancelpay
                }
              })
              that.setData({
                height: that.data.pay.paid.length * 370
              })
            }
          } else if (num === 6) {
            if (res.data.data.list) {
              that.setData({
                cancelpayheight: fixedheight,
                height: datahight,
                cancelpaytotal: res.data.data.total,
                pay: {
                  nopay: that.data.pay.nopay,
                  waitauth: that.data.pay.waitauth,
                  authed: that.data.pay.authed,
                  paid: that.data.pay.paid,
                  cancelpay: that.data.pay.cancelpay.concat(res.data.data.list)
                }
              })
              that.setData({
                height: that.data.pay.cancelpay.length * 370
              })
            }
          }
        }
      }
    })
  },
  //取消订单
  cancelorder(e) {
    let that = this
    let usermessage = app.globalData.usermessage
    let orderNo = e.target.dataset.content
    wx.request({
      url: webUrl + '/api/order/v1/order/cancel',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': "bearer " + app.globalData.token,
      },
      data: {
        "tenantId": usermessage.tenantId,
        "orderNo": orderNo,
        "isMiniSys": 1
      },
      success: function(res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '取消订单成功',
            icon: "success"
          })
          // that.setData({
          //   pageNum: 1
          // })
          if (that.data.currentTab === 0) {
            that.getcancelorder(0)
          } else if (that.data.currentTab === 1) {
            that.getcancelorder(1)
          }
        }
      }
    })

  },
  //取消订单后获取数据
  getcancelorder(num) {
    let that = this
    let usermessage = app.globalData.usermessage
    wx.request({
      url: webUrl + '/api/order/v1/order/list',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': "bearer " + app.globalData.token,
      },
      data: {
        "tenantId": usermessage.tenantId,
        "status": num,
        "pageSize": 10, //每页条数
        "pageNum": that.data.pageNum //页数
      },
      success: function(res) {
        if (res.data.code == 200) {
          let listdata = res.data.data.list
          if (!listdata) {

          } else {
            listdata.map((item) => {
              
              item.actualPay = (item.actualPay / 100).toFixed(2)
              item.price = (item.price / 100).toFixed(2)
            })
          }

          if (num === 0) {
            that.setData({
              pageNum: 1,
              pay: {
                nopay: res.data.data.list,
                waitauth: that.data.pay.waitauth,
                authed: that.data.pay.authed,
                paid: that.data.pay.paid,
                cancelpay: that.data.pay.cancelpay,
              }
            })
          } else if (num === 1) {
            that.setData({
              pageNum: 1,
              pay: {
                nopay: that.data.pay.nopay,
                waitauth: res.data.data.list,
                authed: that.data.pay.authed,
                paid: that.data.pay.paid,
                cancelpay: that.data.pay.cancelpay,
              }
            })
          }

          wx.request({
            url: webUrl + '/api/order/v1/order/list',
            method: 'GET',
            header: {
              'content-type': 'application/json',
              'Authorization': "bearer " + app.globalData.token,
            },
            data: {
              "tenantId": usermessage.tenantId,
              "status": 6,
              "pageSize": 10, //每页条数
              "pageNum": that.data.pageNum //页数
            },
            success: function(res) {
              if (res.data.code == 200) {
                let listdata = res.data.data.list
                listdata.map((item) => {
                  
                  item.actualPay = (item.actualPay / 100).toFixed(2)
                  item.price = (item.price / 100).toFixed(2)
                })
                
                that.setData({
                  pageNum: 1,
                  pay: {
                    nopay: that.data.pay.nopay,
                    waitauth: that.data.pay.waitauth,
                    authed: that.data.pay.authed,
                    paid: that.data.pay.paid,
                    cancelpay: res.data.data.list,
                  }
                })






              }
            }
          })



        }
      }
    })

  },

  orderpay(e) {
    app.globalData.candidate = ""
    app.globalData.candidatemessage = ""
    app.globalData.meal = ""
    app.globalData.candidateId = []
    let content = e.target.dataset.content
    let checkedvalue = content.candidateName
    let newcheckvalueId = []
    let meal = {
      "id": content.packageId,
      "name": content.packageName,
      "description": content.description,
      "price": content.price || 0,
      "childCount": content.childCount || 0
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
  //催授权
  pushAuthorization(e) {
    let that = this
    wx.request({
      url: webUrl + '/api/tenant/v1/esign/urge/auth?orderNo=' + e.target.dataset.content,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': "bearer " + app.globalData.token,
      },
      success: function(res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '催授权成功',
            icon: "success"
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载..-
   */
  onLoad: function(options) {
    console.log(options)
    if (options.finish == 1) {
      this.setData({
        currentTab: options.currentTab || 0
      })
    }
    this.setData({
      currentTab: options.currentTab || 0
    })
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        let clientHeight = res.windowHeight;
        let clientWidth = res.windowWidth;
        let ratio = 750 / clientWidth;
        let height = clientHeight * ratio;
        that.setData({
          clientheight: height
        });
      },
    })
    that.getorderdetail(0)
    that.getorderdetail(1)
    that.getorderdetail(2)
    that.getorderdetail(3)
    that.getorderdetail(6)

  },

  //滑动切换
  swiperTab: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current,
      pageNum: 1,
      height: 0
    });
    

    if (e.detail.current === 0) {
      
      that.setData({
        height: that.data.nopay * 370 || that.data.clientheight
      })
    } else if (e.detail.current === 1) {
      that.setData({
        height: that.data.waitauthheight || that.data.clientheight
      })

    } else if (e.detail.current === 2) {
      that.setData({
        height: that.data.authedheight || that.data.clientheight
      })
    } else if (e.detail.current === 3) {
      that.setData({
        height: that.data.paidheight || that.data.clientheight
      })
    } else if (e.detail.current === 4) {
      that.setData({
        height: that.data.cancelpayheight || that.data.clientheight
      })
    }
  },
  //点击切换
  clickTab: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
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
    let nopaytotal = this.data.nopaytotal
    let waitauthtotal = this.data.waitauthtotal
    let authedtotal = this.data.authedtotal
    let paidtotal = this.data.paidtotal
    let cancelpaytotal = this.data.cancelpaytotal
    let that = this
    if (this.data.currentTab === 0) {
      that.setData({
        height: this.data.pay.nopay.length * 370 || that.data.clientheight
      })
      if (this.data.pay.nopay.length >= nopaytotal) {
        wx.showToast({
          icon: "none",
          title: '已经到了最底部了！',
        })
        return;
      } else {
        let num = that.data.pageNum
        that.setData({
          pageNum: num + 1
        })
        that.getorderdetail(0)
      }
    } else if (this.data.currentTab === 1) {
      that.setData({
        height: this.data.pay.waitauth.length * 370 || that.data.clientheight
      })
      if (this.data.pay.waitauth.length >= waitauthtotal) {
        wx.showToast({
          icon: "none",
          title: '已经到了最底部了！',
        })
        return;
      } else {
        let num = that.data.pageNum
        that.setData({
          pageNum: num + 1
        })
        that.getorderdetail(1)
      }
    } else if (this.data.currentTab === 2) {
      that.setData({
        height: this.data.pay.authed.length * 370 || that.data.clientheight
      })
      if (this.data.pay.authed.length >= authedtotal) {
        wx.showToast({
          icon: "none",
          title: '已经到了最底部了！',
        })
        return;
      } else {
        let num = that.data.pageNum
        that.setData({
          pageNum: num + 1
        })
        that.getorderdetail(2)
      }
    } else if (this.data.currentTab === 3) {
      that.setData({
        height: this.data.pay.paid.length * 370 || that.data.clientheight
      })
      if (this.data.pay.paid.length >= paidtotal) {
        wx.showToast({
          icon: "none",
          title: '已经到了最底部了！',
        })
        return;
      } else {
        let num = that.data.pageNum
        that.setData({
          pageNum: num + 1
        })
        that.getorderdetail(3)
      }
    } else if (this.data.currentTab === 4) {
      that.setData({
        height: this.data.pay.cancelpay.length * 370 || that.data.clientheight
      })
      if (this.data.pay.cancelpay.length >= cancelpaytotal) {
        wx.showToast({
          icon: "none",
          title: '已经到了最底部了！',
        })
        return;
      } else {
        let num = that.data.pageNum
        that.setData({
          pageNum: num + 1
        })
        that.getorderdetail(6)
      }
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})