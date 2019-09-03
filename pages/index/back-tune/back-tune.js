var app = getApp();
var https = app.globalData.https
var url = app.globalData.webUrl
Page({

  /* 
  		type 1: 选择套餐
  			 2：获取到套餐
  			 3：确认订单
  	  */
  data: {
    array: ['余额支付'],
    backdefalut: 0,
    imageUrl: https,
    isShowDetails: false,
    showCoupon: false,
    showPayType: true,
    current: 0,
    type: 1,
    payvalue: 1,

    inputShowed: false, //是否展示密码输入层
    pwdVal: '', //输入的密码
    payFocus: true, //文本框焦点


    meal: "",
    candidate: "",
    candidatelength: "",
    candidatearr: [],
    allprice: "",
    selectcoupons: "",
    preferentialprice: 0, //优惠价格
    preferentialtype: 0,
    note: "",
    allchecked: "",
    orderNoList: [], //订单号

    payTypesIndex: 2,
    showTop: false,
    payTypes: [{
      id: 0,
      type: '微信支付'
    }, {
      id: 1,
      type: '余额支付'
    }],
    couponList: [{}],
  },
  //点击X号关闭
  closepop() {
    this.setData({
      inputShowed: false,
      pwdVal: ""
    })
  },
  /**
   * 显示支付密码输入层
   */
  showInputLayer: function() {
    this.setData({
      inputShowed: true,
      payFocus: true
    });
  },
  /**
   * 隐藏支付密码输入层
   */
  hidePayLayer: function() {
    var val = this.data.pwdVal;
    this.setData({
      inputShowed: false,
      payFocus: false,
      pwdVal: this.data.pwdVal
    }, () => {
      //调用接口用户有没有设置密码
      let tenantId = app.globalData.usermessage.tenantId
      let token = app.globalData.token
      let that = this
      wx.request({
        url: url + '/api/tenant/v1/payPassword/isSet?tenantId=' + tenantId,
        method: "GET",
        header: {
          "Content-Type": "application/json" ,
          'Authorization': "bearer " + token,
        },
        success: function(res) {
          if (res.data.code == 200) {
            if (res.data.data) {
              that.paysuccess()
            } else {
              wx.showToast({
                icon: "none",
                title: "请设置支付密码"
              })
              setTimeout(() => {
                wx.navigateTo({
                  url: "/pages/my/set-pay-password/set-pay-password"
                });
              }, 1000)
              //  跳入去设置支付密码
            }
          } else {
            //调用获得支付密码的接口失败
          }
        }
      })
    });
  },

  /**
   * 获取焦点
   */
  getFocus: function() {
    this.setData({
      inputShowed: true
    });
  },
  /**
   * 输入密码监听
   */
  inputPwd: function(e) {
    let content = e.detail.value
    this.setData({
      pwdVal: content
    });

    if (this.data.pwdVal.length >= 6) {
      this.hidePayLayer();
    }
  },



  //选择银行卡
  bindPickerbankChange(e) {
    this.setData({
      index: e.detail.value,
      backdefalut: 1
    })
  },
  //使用优惠卷
  couponChange(e) {
    let that = this
    let coupons = that.data.couponList
    for (let i = 0; i < coupons.length; i++) {
      if (coupons[i].id == e.detail.value) {
        that.setData({
          current: i,
          selectcoupons: coupons[i],
          preferentialprice: coupons[i].decreaseAmount,
          preferentialtype: 1
        })
      }
    }
    if (!e.detail.value) {
      that.setData({
        allprice: that.data.meal.price
      })
    }
    if (that.data.checked) {
      that.setData({
        allchecked: that.data.checked
      })
    }
  },
  // 打开弹窗
  onTopBtnTap(event) {

    // 使用优惠卷
    if (event.currentTarget.dataset.popup == "coupon") {
      if (!(this.data.couponList.length - 1)) {
        wx.showToast({
          title: '暂无优惠劵',
          icon: "none"
        })
        return
      }
      this.setData({
        showTop: true,
        showCoupon: true
      })
    } else {
      //套餐详情
      if (app.globalData.meal.id) {
        this.setData({
          showTop: true,
          showCoupon: false
        })

      }

    }

  },
  // 关闭弹窗
  onPopupClose() {
    let that = this
    if ((that.data.couponList.length - 1) == 0) {
      this.setData({
        showTop: false,
      });
    } else {
      let coupons = that.data.couponList
      if (this.data.showCoupon) {
        if (that.data.preferentialtype) {
          if (that.data.preferentialprice) {
            that.setData({
              allprice: (that.data.meal.price * that.data.candidatelength - that.data.preferentialprice).toFixed(2),
            })
          }

        } else {
          let defaultmeal = that.data.couponList[0].decreaseAmount
          that.setData({
            preferentialprice: defaultmeal

          })
          that.setData({
            allprice: (that.data.meal.price * that.data.candidatelength - that.data.preferentialprice).toFixed(2),
            selectcoupons: coupons[0],
            preferentialtype: 1
          })
        }

      }
    }
    this.setData({
      showTop: false,
    });
  },
  // 支付方式改变
  bindPickerChange(e) {
    this.setData({
      showPayType: false,
      payTypesIndex: e.detail.value,
    });
  },
  //创建订单
  pay() {
    let that = this
    let token = app.globalData.token
    if (this.data.payvalue == 1) {

      let usermessage = app.globalData.usermessage
      let packageId = that.data.meal.id
      let candidate = this.data.candidate
      //如果没有allchecked直接拿app的
      if (that.data.allchecked) {
        that.setData({
          allchecked: that.data.allchecked
        })
      } else {
        that.setData({
          allchecked: app.globalData.candidatemessage
        })
      }
      //获取选中用户的id
      let checkid = []
      if (this.data.allchecked.length) {
        for (let i = 0; i < this.data.allchecked.length; i++) {
          checkid.push(this.data.allchecked[i].id)
        }
      } else {
        checkid.push(that.data.allchecked.id)
      }
      if (checkid[0]) {
        wx.request({
          url: url + '/api/order/v1/order/create',
          method: "POST",
          header: {
            "Content-Type": "application/json" ,
            'Authorization': "bearer " + token,
          },
          data: {
            tenantId: usermessage.tenantId,
            userId: usermessage.userId,
            packageId: packageId, //套餐 id
            candidateIdList: checkid
          },
          success: function(res) {
            //拿到订单号
            if (res.data.code == 200) {
              // wx.showModal({
              //   title: '提示',
              //   content: '订单成功',
              // })
              that.getCoupon()
              that.setData({
                type: 3
              })
              let orderpart = []
              for (let i = 0; i < res.data.data.orderList.length; i++) {
                orderpart.push(res.data.data.orderList[i].orderNo)
              }
              that.setData({
                orderNoList: orderpart,
                payvalue: 2
              })
            } else {
              if (!that.data.candidate) {
                wx.showModal({
                  title: '提示',
                  content: "请选择候选人",
                })
              }
              if (!that.data.meal) {
                wx.showModal({
                  title: '提示',
                  content: "请选择套餐",
                })
              }

            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '至少选择一个候选人',
        })
      }


    } else {
      //如果是支付的话
      if (!app.globalData.candidate) {
        wx.showToast({
          title: '请选择候选人 ',
          icon: "none"
        })
        return
      }
      console.log(this.data.allprice)
      if (this.data.allprice <= 0) {
        this.paysuccess()
        return false
      }
      if (that.data.payTypesIndex == 1) {
        //调用接口用户有没有设置密码
        let tenantId = app.globalData.usermessage.tenantId
        let token = app.globalData.token
        wx.request({
          url: url + '/api/tenant/v1/payPassword/isSet?tenantId=' + tenantId,
          method: "GET",
          header: {
            "Content-Type": "application/json" ,
            'Authorization': "bearer " + token,
          },
          success: function(res) {
            if (res.data.code == 200) {
              if (res.data.data) {
                that.showInputLayer(); //显示支付密码层
              } else {
                wx.showToast({
                  icon: "none",
                  title: "请设置支付密码"
                })
                setTimeout(() => {
                  wx.navigateTo({
                    url: "/pages/my/set-pay-password/set-pay-password"
                  });
                }, 1000)
                //  跳入去设置支付密码
              }
            } else {
              //调用获得支付密码的接口失败
            }
          }
        })


      } else if (that.data.payTypesIndex == 0) {
        that.wxpay()

      } else {
        wx.showToast({
          title: '请选择支付方式',
          icon: "none"
        })
      }

    }
  },
  //微信支付成功
  wxpay() {
    let that = this
    let usermessage = app.globalData.usermessage
    let packageId = that.data.meal.id
    let orderNoList = that.data.orderNoList
    let remark = that.data.note
    let couponRecordId = ""
    let token = app.globalData.token
    if (that.data.preferentialtype == 0) {
      couponRecordId = ""
    } else {
      couponRecordId = that.data.selectcoupons.id
    }
    wx.request({
      url: url + '/api/order/v1/billing/consume',
      method: "POST",
      header: {
        "Content-Type": "application/json" ,
        'Authorization': "bearer " + token,
      },
      data: {
        userId: usermessage.userId,
        packageId: packageId,
        orderNoList: orderNoList,
        couponRecordId: couponRecordId,
        payType: 2,
        remark: that.data.note,
        isMiniSys: 1,
        openId: app.globalData.openId
      },
      success: function(res) {
        if (res.data.code == 200) {
          let wxmessage = res.data.data
          wx.requestPayment({
            timeStamp: wxmessage.timeStamp,
            nonceStr: wxmessage.nonceStr,
            package: wxmessage.packageParam,
            signType: 'MD5',
            paySign: wxmessage.paySign,
            success(res) {
              app.globalData.candidatemessage = ""
              app.globalData.candidate = ""
              app.globalData.meal = ""
              app.globalData.candidateId = []
              app.globalData.tenantList = {}
              wx.navigateTo({
                url: '/pages/my/use-coupon/use-coupon?finish=1',
              })
            },
            fail(res) {}
          })
        } else {
          wx.showToast({
            title: '支付失败',
            icon: "none"
          })
        }
      }
    })
  },
  //余额支付成功
  paysuccess() {
    let that = this
    let usermessage = app.globalData.usermessage
    let packageId = that.data.meal.id
    let orderNoList = that.data.orderNoList
    let remark = that.data.note
    let couponRecordId = ""
    let token = app.globalData.token
    if (that.data.preferentialtype == 0) {
      couponRecordId = ""
    } else {
      if (!that.data.selectcoupons.id) {
        couponRecordId = ""
      } else {
        couponRecordId = that.data.selectcoupons.id
      }

    }
    wx.request({
      url: url + '/api/order/v1/billing/consume',
      method: "POST",
      header: {
        "Content-Type": "application/json" ,
        'Authorization': "bearer " + token,
      },
      data: {
        userId: usermessage.userId,
        packageId: packageId,
        orderNoList: orderNoList,
        couponRecordId: couponRecordId,
        payType: 0,
        password: that.data.pwdVal,
        remark: that.data.note
      },
      success: function(res) {
        if (res.data.code == 200) {
          app.globalData.candidatemessage = ""
          app.globalData.candidate = ""
          app.globalData.candidateId = []
          app.globalData.meal = ""
          app.globalData.tenantList = {}
          that.setData({
            pwdVal: ''
          })
          wx.showToast({
            title: "支付成功",
            icon: 'succes',
            duration: 2000,
            mask: true
          })
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/my/use-coupon/use-coupon?finish=1',
            })
          }, 2000)
        } else {
          that.setData({
            pwdVal: ""
          })
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 2000,
            mask: true
          })
        }
      }
    })
  },
  //改变备注
  note(e) {
    this.setData({
      note: e.detail.value
    })
  },
  //选择套餐
  selectmeal() {
    wx.navigateTo({
      url: '../meal-list/meal-list',
    })
  },
  enteraddcandidate() {
    wx.navigateTo({
      url: '../add-candidate/add-candidate',
    })
  },
  //删除候选人
  detailcandidate(e) {
    let candidatearr = this.data.candidatearr
    candidatearr.splice(e.currentTarget.dataset.id, 1)
    app.globalData.candidateId.splice(e.currentTarget.dataset.id, 1)
    this.setData({
      candidatearr: candidatearr,
      candidatelength: candidatearr.length

    })
    let newarr = app.globalData.candidate.split(',')
    newarr.splice(e.currentTarget.dataset.id, 1)
    app.globalData.candidate = newarr.join(",")
    let allschecked = this.data.allchecked
    if (allschecked.length > 0) {
      allschecked.splice(e.currentTarget.dataset.id, 1)
      this.setData({
        allchecked: allschecked,
        allprice: (this.data.meal.price * this.data.candidatelength - this.data.preferentialprice).toFixed(2)
      })
    }
    if (!allschecked) {
      app.globalData.candidatemessage = ""
    }

    this.getCoupon()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let candidatemessage = app.globalData.candidatemessage
    let candidateId = app.globalData.candidateId

    if (options.checkedvalue) {
      app.globalData.candidateId = candidateId.concat(JSON.parse(options.checkedId))
      if (app.globalData.candidate) {
        app.globalData.candidate = app.globalData.candidate + ',' + options.checkedvalue
      } else {
        app.globalData.candidate = app.globalData.candidate + options.checkedvalue
      }
      this.setData({
        candidatearr: app.globalData.candidate.split(','),
        candidatelength: app.globalData.candidate.split(',').length
      })
      this.setData({
        type: 2,
        candidate: app.globalData.candidate,
        meal: app.globalData.meal,
        allprice: (app.globalData.meal.price * that.data.candidatelength).toFixed(2)
      })
      if (that.data.checked) {
        that.setData({
          allchecked: that.data.checked
        })
      }
    }
    //候选人的数量
    if (app.globalData.candidate) {
      this.setData({
        candidatearr: app.globalData.candidate.split(','),
        candidatelength: app.globalData.candidate.split(',').length
      })
    }
    if (options.meal) {
      let meal = JSON.parse(options.meal)
      app.globalData.meal = meal

      that.setData({
        type: 2,
        meal: app.globalData.meal,
        candidate: app.globalData.candidate,
        allprice: (app.globalData.meal.price * that.data.candidatelength).toFixed(2)
      })
    }
    if (that.data.meal && that.data.candidate) {
      // that.setData({
      //   type: 3
      // })
      //获取优惠卷
      // that.getCoupon()
    }
    if (options.checked) {
      let checked = JSON.parse(options.checked)

      if (app.globalData.candidatemessage) {
        let newarr = ""
        newarr = checked.concat(app.globalData.candidatemessage)
        app.globalData.candidatemessage = newarr
      } else {
        app.globalData.candidatemessage = checked
      }
      this.setData({
        allchecked: app.globalData.candidatemessage
      })
    }
    //我的订单传来的数据
    if (options.myOrder) {
      let myOrderdata = JSON.parse(options.myOrder)
      let orderNoarry = []
      orderNoarry.push(myOrderdata.orderNo)
      this.setData({
        orderNoList: orderNoarry,
        payvalue: 2,
        type: 3
      })
      that.getCoupon()

    }
  },
  //  获取优惠卷
  getCoupon() {
    let that = this
    let usermessage = app.globalData.usermessage
    wx.request({
      url: url + '/api/order/v1/couponRecord/getCouponWithOrder?tenantId=' + app.globalData.usermessage.tenantId + '&fee=' + that.data.meal.price * 100 * app.globalData.candidateId.length,
      method: "GET",
      header: {
        "Content-Type": "application/json",
        'Authorization': "bearer " + app.globalData.token,
      },
      success: function(res) {
        if (res.data.code == 200) {
          let coupons = res.data.data
          coupons.map((item) => {
            item.decreaseAmount = (item.decreaseAmount / 100).toFixed(2)
          })
          let obj = {
            id: '',
            name: "不使用优惠券",
            type: 0,
            decreaseAmount: ""
          }
          coupons.push(obj)
          that.setData({
            couponList: coupons
          })
        }
      }
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
    let that = this
    console.log('onShow')
    if (app.globalData.candidate) {
      this.setData({
        candidatearr: app.globalData.candidate.split(','),
        candidatelength: app.globalData.candidate.split(',').length
      })
    } else {
      this.setData({
        meal: app.globalData.meal,
        type: 2,
        candidatearr: "",
        candidatelength: []
      })
    }
    if (!(this.data.meal || this.data.candidatearr[0])) {
      this.setData({
        type: 1
      })
    }
    if (this.data.meal.price && this.data.candidatelength) {
      this.setData({
        allprice: (this.data.meal.price * this.data.candidatelength).toFixed(2) - this.data.preferentialprice
      })
    }
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