// pages/my/helpCenter/helpCenter.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    https: app.globalData.https,
    helpCenterList: [{
        text: "职兔背调是什么？",
      content: ['职兔背调是杭州数脉科技有限公司旗下雇佣风控管理平台，平台通过大数据+专业顾问的服务模式，在候选人授权情况 下，合法、合规地帮助企业HR在招聘环节有效防范身份、学历、职业资格、社会不良记录、履历造假等不诚信行为。'],
        image: app.globalData.https + "index-meal-icon2.png"
      },
      {
        text: "职兔背调的使用流程？",
        content: ['企业首先通过官网或移动端注册并进行实名认证后，即可以使用平台的各个功能，背景调查只需三步：', '1.发起背调：在职兔背调平台上根据需求灵活选择或定制套餐，发起背调', '2.候选人授权：候选人收到短信或邮件，在线电子签名完成授权', '3.反馈报告：职兔背调平台查询数据源，生成报告并反馈给企业HR。'],
        image: app.globalData.https + "index-meal-icon2.png"
      },
      {
        text: "为什么需要候选人授权？",
        content: ['职兔背调严格要求企业对候选人的每次背调都需要得到候选人授权，目的主要为了保障企业及候选人双方的利益，确保背调过程合法、合规。'],
        image: app.globalData.https + "index-meal-icon2.png"
      },
      {
        text: "一般多久出报告？",
        content: ['线上极速背调：客观项的查询（指通过国家相关数据库查询），候选人授权后立即生成报告。','线下顾问访谈：1段工作履历3个工作日（可以加急到2个工作日），2段及以上工作履历核实5个工作日，（可以加急到3工作日）。'],
        image: app.globalData.https + "index-meal-icon2.png"
      },
      {
        text: "职兔背调的合作方式？",
        content: ['1.在线注册认证后即可使用：职兔背调是一个智能背调SaaS平台，在官网、小程序等完成注册和实名认证后即可使用各个功能。', '2.通过API与职兔平台对接：企业可以通过API的方式，使自有人力资源系统与职兔平台完成对接，灵活规划产品。', '更多需求或咨询，请联系：0571-89020021'],
        image: app.globalData.https + "index-meal-icon2.png"
      },
      {
        text: "同一个公司是否可以开多个账户？",
        content: ['同一个公司名称可以开通一个主账户（注册后即为主账户），主账户下可以添加多个子账号。'],
        image: app.globalData.https + "index-meal-icon2.png"
      },
      {
        text: "职兔背调如何收费？",
        content: ['可以支持预充值后消费，也可以下单后在线支付。', '有四个套餐每个套餐有相应价格股份；有十多个背调项目，单个背调项价格期间为1-20元，企业可以根据自己的需求进行自由组合定制；履历核实需要专业顾问进行访谈，按段收费。'],
        image: app.globalData.https + "index-meal-icon2.png"
      }
    ],
    i: ["", "", "", "", "", "", ""]
  },
  openDetail(e) {
    const vm = this;
    const {
      i,
      helpCenterList
    } = vm.data;
    if ((i[e.currentTarget.dataset.i] && i[e.currentTarget.dataset.i] === e.currentTarget.dataset.i) || i[e.currentTarget.dataset.i] === 0) {
      helpCenterList[e.currentTarget.dataset.i].image = app.globalData.https + "index-meal-icon2.png"
      i[e.currentTarget.dataset.i] = ""
      vm.setData({
        i: i,
        helpCenterList: helpCenterList
      })
    } else {
      i[e.currentTarget.dataset.i] = e.currentTarget.dataset.i
      helpCenterList[e.currentTarget.dataset.i].image = app.globalData.https + "index-meal-icon.png"
      vm.setData({
        i: i,
        helpCenterList: helpCenterList
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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