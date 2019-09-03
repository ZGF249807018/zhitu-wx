var app = getApp();
var https = app.globalData.https
var url = app.globalData.webUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    imageUrl: https,
    _position: 0,
    height: "",

    searchPageNum: 1, //页数
    total: "", //获取数据总数
    checkedvalue: "",
    k: 0, //用来判断是否跳转

    username: "",
    CardId: "",
    mobile: "",
    content: "",

    items: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    // 加载页面默认高度为屏幕高度
    wx.getSystemInfo({
      success: function(res) {
        let clientHeight = res.windowHeight;
        let clientWidth = res.windowWidth;
        that.setData({
          height: clientHeight
        });
      }
    });
    this.getpeople()
  },
  //获取人才库的数据
  getpeople() {
    let num = 1
    let that = this
    let token = app.globalData.token
    wx.request({
      url: url + '/api/order/v1/candidate/choose/list',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded" ,
        'Authorization': "bearer " + token,
      },
      data: {
        pageNo: num,
        pageSize: 8
      },
      success: function(res) {
        if (res.data.code == 200) {
          let pepoledata = res.data.data.list
          that.setData({
            total: res.data.data.total
          })
          for (let i = 0; i < pepoledata.length; i++) {
            let surname = pepoledata[i].name.substring(0, 1)
            pepoledata[i]['surname'] = surname
            pepoledata[i]['checked'] = false
          }
          that.setData({
            items: pepoledata
          })
        } else {
          wx.showToast({
            title: '数据加载失败',
            icon: "none"
          })
        }
      }
    })
  },


  swiperTab: function(e) {
    let that = this;
    let datahight = 170 * that.data.items.length + 98;
    // 如果人才库选择
    if (e.detail.current == 1) {
      wx.getSystemInfo({
        success: function(res) {
          let clientHeight = res.windowHeight;
          let clientWidth = res.windowWidth;
          let ratio = 750 / clientWidth;
          let height = clientHeight * ratio - 197;
          if (datahight < height) {
            that.data._position = 0
          } else {
            that.data._position = 1
          }
          that.setData({
            _position: that.data._position
          });
        }
      });
      that.setData({
        height: datahight + 150
      })
    } else {
      // 如果手动添加
      that.setData({
        height: 300
      })
      that.data._position = 0
      that.setData({
        _position: that.data._position
      });
    }
    that.setData({
      currentTab: e.detail.current
    });
  },
  clickTab: function(e) {
    var that = this;
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
  },

  enterjobwantedTable(e) {
    wx.navigateTo({
      url: '/pages/talentPool/jobWantedTbale/jobWantedTbale?id=' + e.currentTarget.dataset.candidateid,
    })
  },
  getContent(e) {
    this.setData({
      content: e.detail.value
    })
  },
  search() {
    const vm = this;
    this.setData({
      searchPageNum: 1
    })
    const {
      searchPageNum,
      content
    } = vm.data;
    wx.request({
      url: url + '/api/order/v1/candidate/choose/list',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': "bearer " + app.globalData.token,
      },
      data: {
        pageNo: searchPageNum,
        pageSize: 10,
        property: content
      },
      success: function(res) {
        if (res.data.code === 200) {
          res.data.data.list.map(item => {
            let sex = item.name.slice(0, 1)
            item.surname = sex
          })
          vm.setData({
            items: res.data.data.list
          })
        }
      }
    });
  },
  //改变姓名
  chanceusername(e) {
    this.setData({
      username: e.detail.value,
    })
  },
  // 身份证号码
  chanceCardId(e) {
    this.setData({
      CardId: e.detail.value,
    })
  },
  //改变手机号码
  chancemobile(e) {
    this.setData({
      mobile: e.detail.value,
    })
  },
  //哪一个选中
  onChange(e) {
    let items = this.data.items
    let detailValue = e.detail.value
    items.forEach((item) => {
      detailValue.forEach((detailValuechild) => {
        if (item.id === detailValuechild) {
          item.checked = true
          this.setData({
            items: items
          })

        }
      })
    })
    this.setData({
      checkedvalue: e.detail.value
    })
  },
  //点击确定
  sure(e) {
    let that = this
    if (e.target.dataset.position === 0) {
      let token = app.globalData.token
      let name = this.data.username
      let idCard = this.data.CardId
      let mobile = this.data.mobile
      if (!(name || idCard || mobile)) {
        wx.showToast({
          title: '请填写信息后，再提交',
          icon: "none"
        })
        return
      }
      wx.request({
        url: url + '/api/order/v1/candidate/add',
        method: "POST",
        header: {
          "Content-Type": "application/json" ,
          'Authorization': "bearer " + token,
        },
        data: {
          name: name,
          idCard: idCard,
          mobile: mobile
        },
        success: function(res) {
          if (res.data.code == 200) {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
            // that.setData({
            //   username: "",
            //   CardId: "",
            //   mobile: ""
            // })
            let newcheckvaluename = []
            let newcheckvalue = []
            let newcheckvalueId = []
            let candidate = {
              id: res.data.data,
              idCard: idCard,
              mobile: mobile,
              name: name
            }
            newcheckvaluename.push(name)
            newcheckvalue.push(candidate)
            newcheckvalueId.push(res.data.data)
            wx.navigateTo({
              url: '../back-tune/back-tune?checkedvalue=' + newcheckvaluename + '&checked=' + JSON.stringify(newcheckvalue) + '&checkedId=' + JSON.stringify(newcheckvalueId),
            })
            // that.getpeople()
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
            })
          }
        }
      })
    } else if (e.target.dataset.position === 1) {

      this.setData({
        k: 0
      })

      let that = this
      let newcheckvalue = []
      let newcheckvalueId = []
      let newcheckvaluename = []
      if (!that.data.checkedvalue.length) {
        wx.showToast({
          title: '请至少添加一个候选人',
          icon: "none"
        })
        return
      }
      for (let i = 0; i < that.data.items.length; i++) {
        for (let j = 0; j < that.data.checkedvalue.length; j++) {
          if (that.data.items[i].id == that.data.checkedvalue[j]) {
            newcheckvalue.push(that.data.items[i])
            newcheckvalueId.push(that.data.items[i].id)
            newcheckvaluename.push(that.data.items[i].name)
          }
        }
      }
      if (!app.globalData.candidateId[0]) {
        wx.redirectTo({
          url: '../back-tune/back-tune?checkedvalue=' + newcheckvaluename + '&checked=' + JSON.stringify(newcheckvalue) + '&checkedId=' + JSON.stringify(newcheckvalueId),
        })
      } else {
        app.globalData.candidateId.forEach((item) => {
          newcheckvalue.forEach((items) => {
            if (item == items.id) {
              wx.showModal({
                title: '提示',
                content: '该候选人已经添加'
              });
              that.setData({
                k: 1
              })
            } else {}
          })
        })
        if (that.data.k === 0) {
          wx.redirectTo({
            url: '../back-tune/back-tune?checkedvalue=' + newcheckvaluename + '&checked=' + JSON.stringify(newcheckvalue) + '&checkedId=' + JSON.stringify(newcheckvalueId),
          })
        }
      }
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
    let that = this
    if (this.data.items.length < that.data.total) {
      this.setData({
        searchPageNum: this.data.searchPageNum + 1,
      })
      let token = app.globalData.token
      wx.request({
        url: url + '/api/order/v1/candidate/choose/list',
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded" ,
          'Authorization': "bearer " + token,
        },
        data: {
          pageNo: this.data.searchPageNum,
          pageSize: 8
        },
        success: function(res) {
          if (res.data.code == 200) {
            let pepoledata = res.data.data.list
            for (let i = 0; i < pepoledata.length; i++) {
              let surname = pepoledata[i].name.substring(0, 1)
              pepoledata[i]['surname'] = surname
            }
            let newarr = that.data.items.concat(pepoledata)
            that.setData({
              items: newarr
            })
            that.setData({
              height: that.data.items.length * 170 + 180
            })
          }
        }
      })
    } else {
      wx.showToast({
        icon: "none",
        title: '已经到了最底部了！',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})