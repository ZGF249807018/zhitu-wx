// pages/report/report.js
var app = getApp();
var https = app.globalData.https
const webUrl = app.globalData.webUrl;
var time = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tenantList: {},
    imageUrl: https,
    https: https,
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
    exmpletab: false,
    // 展开折叠
    selectedFlag: [false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    zhitushow: {
      badbehaviorshow: 1,
      financialRiskshow: 1,
      operatorInformationshow: 1,
      performRecordsshow: 1,
      administrativeExportshow: 1,
      professionalQualificationshow: 1,
      courtCaseshow: 1,
      legalPersonshow: 1,
      highestshow: 1,
      brokenPromisesshow: 1
    },
    candidatemessage: "",
    candidate: "",
    mobileValidation: "",
    operatorInformation: "",
    badbehavior: "",
    financialRisk: "",
    borrowing: "",
    borrowingRisk: "",
    highest: "",
    professionalQualification: [],
    administrativeExport: "",
    courtCase: "",
    performRecords: "",
    brokenPromises: [],
    legalPerson: "",
    work: "",
    cvStaues: 1
  },
  // 展开折叠
  changeToggle(e) {
    this.data.selectedFlag[e.currentTarget.dataset.id] = !this.data.selectedFlag[e.currentTarget.dataset.id]
    this.setData({
      selectedFlag: this.data.selectedFlag
    })
  },
  cancelemailaddress() {
    this.setData({
      modalbottom: false
    })
  },
  sendEmail() {
    let {
      tenantList
    } = this.data
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
  printTable() {
    this.setData({
      modalbottomprint: true
    })
  },
  onModalClick() {
    this.setData({
      modalOpened: false,
    });
  },
  onModalClose() {
    this.setData({
      modalOpened: false,
    });
  },
  sendemailaddress() {
    const vm = this;
    const {
      userList,
      candidateId
    } = vm.data;
    wx.request({
      url: webUrl + '/api/report/v1/report/send',
      method: 'POST',
      header: {
        "content-type": 'application/x-www-form-urlencoded',
        'Authorization': "bearer " + app.globalData.token,
      },
      data: {
        uids: app.globalData.usermessage.userId,
        orders: vm.data.candidatemessage.orderNo
      },
      success: function(res) {

        if (res.data.code === 200) {
          wx.showToast({
            icon: 'success',
            title: '已发送邮件'
          });
          vm.setData({
            modalbottom: false,
          });
        }
      },
      fail: function(res) {

      },
      complete: function(res) {

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
  //获取报告详情的所有数据
  getallreport(orderno) {

    let that = this

    //获得头部的接口数据
    wx.request({
      url: webUrl + '/api/report/v1/html/report/cover?orderNo=' + orderno,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': "bearer " + app.globalData.token,
      },
      success: function(res) {
        if (res.data.code == 200) {
          that.setData({
            candidatemessage: res.data.data
          })

        } else {
          wx.showModal({
            title: '提示',
            content: '该报告未完成',
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              } else {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
      }
    });

    wx.request({
      url: webUrl + '/api/report/v1/html/report/detail?orderNo=' + orderno,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': "bearer " + app.globalData.token,
      },
      success: function(res) {

        if (res.data.code === 200) {
          console.log(res.data.data)
          that.setData({
            candidate: res.data.data.candidate,
            mobileValidation: res.data.data.SJSMHY,
            operatorInformation: res.data.data.YYSXX,
            badbehavior: res.data.data.BLXWJL,
            financialRisk: res.data.data.JRHMD,
            borrowing: res.data.data.MULTILOAN,
            borrowingRisk: res.data.data.MULTILOAN_RISK,
            highest: res.data.data.ZGXLYZ,
            professionalQualification: res.data.data.GRZYZGXX,
            administrativeExport: res.data.data.XZPLXX,
            courtCase: res.data.data.GRSSXX,
            performRecords: res.data.data.BZXJL,
            brokenPromises: res.data.data.SXBZX,
            legalPerson: res.data.data.GRGSXX,
            work: res.data.data.WORK,
            zhitushow: {
              badbehaviorshow: res.data.data.BLXWJL_,
              financialRiskshow: res.data.data.JRHMD_,
              operatorInformationshow: res.data.data.YYSXX_,
              performRecordsshow: res.data.data.BZXJL_,
              administrativeExportshow: res.data.data.XZPLXX_,
              professionalQualificationshow: res.data.data.GRZYZGXX_,
              courtCaseshow: res.data.data.GRSSXX_,
              legalPersonshow: res.data.data.GRGSXX_,
              highestshow: res.data.data.ZGXLYZ_,
              brokenPromisesshow: res.data.data.SXBZX_
            }
          })
          if (!that.data.work) {
            that.setData({
              cvStaues: 1
            })
            return
          }
          let work = that.data.work

          for (let i = 0; i < work.length; i++) {

            if (work[i].workHistory.isConsistent === 1) {
              that.setData({
                cvStaues: 0
              })

            }
          }

        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({
      tenantList: app.globalData.tenantList
    })

    if (!options) {
      return
    }
    console.log(options)
    if (options.exmple == 1) {
      this.setData({
        candidatemessage: {
          "orderNo": "532259497905754112",
          "company": "123",
          "candidateName": "王**",
          "packageName": "标准版",
          "reportTime": "2018-10-10 12:00:11"
        },
        candidate: {
          "id": 145,
          "candidateNo": null,
          "tenantId": 3,
          "userId": 1,
          "isSurveyed": 1,
          "name": "王**",
          "mobile": "18346728064",
          "idCard": "5222222232******2819",
          "currentState": 2,
          "email": "1014539996@qq.com",
          "politicalStatus": 1,
          "highestEducation": "本科",
          "workingNum": 2,
          "position": "技术总监",
          "currentSalary": 1000,
          "expectedSalary": 10000000000,
          "arrivalTime": 1608825600000,
          "contact": "王**",
          "contactMobile": "18858132415",
          "relation": "本人",
          "maritalStatus": "",
          "nativeNature": null,
          "signaturePicUrl": "logo/2018/12/11/846bca6f5b104a10934587d1b214e546.jpg",
          "signatureTime": 1551411890000,
          "currentAddress": "",
          "nativeAddress": "贵州省贵阳市南明区",
          "birthday": "1988-10-26",
          "sex": "男",
          "verify3Result": null
        },
        mobileValidation: {
          "status": "已查得",
          "result": "实名认证通过"
        },
        operatorInformation: {
          "carrierName": "中国移动",
          "belongCity": "浙江杭州",
          "time": "24个月以上",
          "status": "在网"
        },
        badbehavior: {
          "id": 2,
          "createTime": 1541137149000,
          "modifyTime": 1541137149000,
          "code": "0",
          "message": "成功",
          "orderNo": "532259497905754112",
          "res": 1,
          "name": "王**",
          "idCard": "320106198612292011",
          "caseType": "金融诈骗案",
          "time": "5-10年（不含）以内",
          "level": "严重",
          "source": "前科",
          "count": "1",
          "type": "其他"
        },
        // financialRisk: {
        //   "id": "28cfad1e013244cd90ad8fe964007444",
        //   "orderNo": "532259497905754112",
        //   "name": "冯宝宝",
        //   "mobile": "18012345678",
        //   "idcard": "350301194401279422",
        //   "code": "0",
        //   "message": "成功",
        //   "res": "1",
        //   "description": "命中黑名单",
        //   "createTime": 1529374965000,
        //   "modifyTime": 1529374965000
        // },
        borrowing: {
          "overdueNum": 0,
          "registerNum": 8,
          "applyNum": 0,
          "loansNum": 2,
          "debtNum": 2,
          "rejectNum": 2
        },
        highest: {
          "id": 2,
          "createTime": 1540133389000,
          "modifyTime": 1540133389000,
          "code": "0",
          "message": "成功",
          "name": "李亚敏",
          "idNo": "102007071524",
          "orderNo": "532259497905754112",
          "res": 1,
          "schoolName": "北京大学",
          "diploma": "本科",
          "enrollStyle": "普通全日制",
          "gradTime": "20070715",
          "gradType": "毕业",
          "gradeNo": null
        },
        professionalQualification: [{
          "id": 3,
          "createTime": 1544435205000,
          "modifyTime": 1544435205000,
          "code": "0",
          "message": "成功",
          "orderNo": "532259497905754112",
          "name": "王**",
          "idNo": "1611010000031",
          "res": 1,
          "computer": "85",
          "text": "60.5",
          "level": "三级/高级技能",
          "report": "浙江省职业技能鉴定指导中心",
          "certificateNum": "1611010000313122",
          "professional": "计算机操作员"
        }],
        administrativeExport: {
          "totalAmount": "171000.0",
          "count": "2",
          "courtDefaultList": [{
            "releaseTime": "20170815",
            "courtName": "***人民法院",
            "executeDarget": "75000.00",
            "fillingDate": "20170725",
            "caseInfo": "被告***应于本判决生效之日起十五日内偿还原告***借款75000元，并按中国人民银行同期同类贷款利率支付自2014年5月21日起至判决确定的还款之日止的利息…"
          }, {
            "releaseTime": "20170915",
            "courtName": "***人民法院",
            "executeDarget": "75000",
            "fillingDate": "20170825",
            "caseInfo": "被告***结欠原告***借款96000元，被告***定于自2014年9月起(含当月)至2015年7月止(含当月)，每月28日前还款2000元…。"
          }]
        },
        courtCase: {
          "cpws": {
            "dataType": "zxgg",
            "title": "王**与张**产品销售合同一案",
            "reviewTime": "2017/2/23",
            "content": "一审"
          },
          "zxgg": {
            "dataType": "zxgg",
            "title": "王**与张**产品销售合同一案",
            "reviewTime": "2017/7/25",
            "content": "***人民法院"
          }
        },
        performRecords: [{
            "courtName": "云南***县人民法院",
            "filingTime": "20170725",
            "releaseTime": "10170730",
            "caseCode": "(2017)云0112执220号"
          }, {
            "courtName": "云南***县人民法院",
            "filingTime": "20170725",
            "releaseTime": "10170730",
            "caseCode": "(2017)云0112执220号"
          },
          // {
          //   "courtName": "宁洱哈尼族彝族自治县人民法院",
          //   "filingTime": "2011-09-21",
          //   "releaseTime": "",
          //   "caseCode": "(2011)宁执字第00079号"
          // }
        ],
        brokenPromises: [{
            "caseCode": "(2017)云0112执220号",
            "releaseTime": "10170730",
            "exeUnit": "云南***县人民法院",
            "sex": "男",
            "filingTime": "20170725",
            "type": "0",
            "disruptTypeName": "有履行能力而拒不履行生效法律文书确定义务",
            "performance": "全部未履行",
            "courtName": "云南***县人民法院",
            "areaName": "云南",
            "exeCode": "(2016)渝0105民初12201号",
            "duty": "被告XX应于本判决生效之日起15日内偿还本金100万和利息8.1万给上海**科技有限公司",
            "age": "58"
          }, {
            "caseCode": "(2017)云0112执220号",
            "releaseTime": "20170730",
            "exeUnit": "云南***县人民法院",
            "sex": "男",
            "filingTime": "20170725",
            "type": "0",
            "disruptTypeName": "其他有履行能力而拒不履行生效法律文书确定义务",
            "performance": "全部未履行",
            "courtName": "云南***县人民法院",
            "areaName": "云南",
            "exeCode": "(2017)云0112执220号",
            "duty": "被告XX应于本判决生效之日起15日内偿还本金100万和利息8.1万给上海**科技有限公司",
            "age": "56"
          },
           {
            "caseCode": "(2014)江法民执字第00817号",
            "releaseTime": "2014-09-18",
            "exeUnit": "重庆市江北区人民法院",
            "sex": "男",
            "filingTime": "2014-04-29",
            "type": "0",
            "disruptTypeName": "其他有履行能力而拒不履行生效法律文书确定义务",
            "performance": "全部未履行",
            "courtName": "重庆市江北区人民法院",
            "areaName": "重庆",
            "exeCode": "(2013)江法民初字第02543号",
            "duty": "法院生效裁判:判决张曾于本判决生效之日后十日内归还董长春10万元，并从2012年4月11日起付清之日止，以未还款金额为基数，按照中国人民银行公布的金融机构同期贷款基准利率的四倍支付利息。张正权对张曾的上述债务承担连带责任。如果未按本判决指定的期间履行给付金钱义务，应当按照《中华人民共和国民事诉讼法》第二百五十三条之规定，加倍支付迟延履行的债务利息。",
            "age": "56"
          }, {
            "caseCode": "(2013)渝北法民执字第00815号",
            "releaseTime": "2013-10-10",
            "exeUnit": "重庆市渝北人民法院",
            "sex": "男",
            "filingTime": "2013-01-16",
            "type": "0",
            "disruptTypeName": "其它规避执行,违反财产报告制度,其他有履行能力而拒不履行生效法律文书确定义务",
            "performance": "全部未履行",
            "courtName": "重庆市渝北区人民法院",
            "areaName": "重庆",
            "exeCode": "(2012)渝北法民初字第03933号",
            "duty": "被告偿还借款本金30万元级相应利息，承担诉讼费5800元",
            "age": "55"
          }, {
            "caseCode": "(2017)渝0102执2070号",
            "releaseTime": "2017-08-17",
            "exeUnit": "重庆市涪陵区人民法院",
            "sex": "男",
            "filingTime": "2017-05-05",
            "type": "0",
            "disruptTypeName": "有履行能力而拒不履行生效法律文书确定义务,其他规避执行",
            "performance": "全部未履行",
            "courtName": "重庆市涪陵区人民法院",
            "areaName": "重庆",
            "exeCode": "(2016)渝0102民初1537号",
            "duty": "(2016)渝0102民初1537号",
            "age": "58"
          }, {
            "caseCode": "(2012)中区法民执字第01677号",
            "releaseTime": "2015-01-05",
            "exeUnit": "重庆市公证处",
            "sex": "男",
            "filingTime": "2012-11-27",
            "type": "0",
            "disruptTypeName": "其他有履行能力而拒不履行生效法律文书确定义务",
            "performance": "全部未履行",
            "courtName": "重庆市渝中区人民法院",
            "areaName": "重庆",
            "exeCode": "2011渝证字第34087号",
            "duty": "公证债权文书：张正权、张曾、曾德芳共同向邱浩借款人民币三十万元整。",
            "age": "56"
          }, {
            "caseCode": "(2013)南法民执字第00583号",
            "releaseTime": "2014-06-20",
            "exeUnit": "重庆市南岸区人民法院",
            "sex": "男",
            "filingTime": "2013-05-23",
            "type": "0",
            "disruptTypeName": "其他有履行能力而拒不履行生效法律文书确定义务",
            "performance": "全部未履行",
            "courtName": "重庆市南岸区人民法院",
            "areaName": "重庆",
            "exeCode": "(2012)南法民初字第06017号",
            "duty": "法院生效裁判:调解",
            "age": "56"
          }, {
            "caseCode": "(2017)渝0103执2808号",
            "releaseTime": "2017-07-04",
            "exeUnit": "重庆市渝中区人民法院",
            "sex": "男",
            "filingTime": "2017-02-23",
            "type": "0",
            "disruptTypeName": "有履行能力而拒不履行生效法律文书确定义务,违反财产报告制度,违反限制高消费令,被执行人无正当理由拒不履行执行和解协议",
            "performance": "全部未履行",
            "courtName": "重庆市渝中区人民法院",
            "areaName": "重庆",
            "exeCode": "(2016)渝0103民初10693号",
            "duty": "张正权支付郑木珠6万元。",
            "age": "58"
          }, {
            "caseCode": "(2016)渝0105执2299号",
            "releaseTime": "2016-05-19",
            "exeUnit": "重庆市江北区人民法院",
            "sex": "男",
            "filingTime": "2016-05-12",
            "type": "0",
            "disruptTypeName": "其他有履行能力而拒不履行生效法律文书确定义务",
            "performance": "全部未履行",
            "courtName": "重庆市江北区人民法院",
            "areaName": "重庆",
            "exeCode": "（2015）江法民初字第6872号",
            "duty": "见判决书",
            "age": "58"
          }
        ],
        legalPerson: {
          "representative": [{
            "ent_status": "在营（开业）",
            "reg_org_province": "北京市",
            "reg_no": "110302017417792",
            "reg_cap_currency": "人民币",
            "credit_code": "3301********8632",
            "ent_type": "有限责任公司(自然人投资)",
            "reg_capital": "5000.00",
            "person_name": "王**",
            "ent_name": "杭州***科技有限公司",
            "ind_cat_name": "租赁和商务服务业",
            "establish_date": "2014-06-17",
            "person_id": "V1!i0Fxv5kw0M0Pe9Nox5ic+1oZgTfItG+D+JKBEuwbRhJPs97CJDbko46zV0HpjW0f7ISGADHTLt3k<n>/ZyJzTNriA=="
          }, {
            "ent_status": "在营（开业）",
            "reg_org_province": "江苏省",
            "reg_no": "321321000128818",
            "reg_cap_currency": "人民币",
            "credit_code": "3301********8632",
            "ent_type": "有限责任公司(自然人投资)",
            "reg_capital": "5000.00",
            "person_name": "王**",
            "ent_name": "杭州***科技有限公司",
            "ind_cat_name": "租赁和商务服务业",
            "establish_date": "2017-06-23",
            "person_id": "V1!i0Fxv5kw0M0Pe9Nox5ic+1oZgTfItG+D+JKBEuwbRhJPs97CJDbko46zV0HpjW0f7ISGADHTLt3k<n>/ZyJzTNriA=="
          }],
          "executive": [{
              "ent_status": "在营（开业）",
              "reg_org_province": "北京市",
              "reg_no": "3301********8632",
              "reg_cap_currency": "人民币",
              "ent_type": "有限责任公司(自然人投资)",
              "reg_capital": "5000.00",
              "person_name": "王**",
              "credit_code": "91110105397829289G",
              "ent_name": "杭州***科技有限公司",
              "position": "执行董事兼总经理",
              "ind_cat_name": "交通运输、仓储和邮政业",
              "establish_date": "2014-06-09",
              "person_id": "V1!i0Fxv5kw0M0Pe9Nox5ic+1oZgTfItG+D+JKBEuwbRhJPs97CJDbko46zV0HpjW0f7ISGADHTLt3k<n>/ZyJzTNriA=="
            }, {
              "ent_status": "在营（开业）",
              "reg_org_province": "河北省",
              "reg_no": "3301********8632",
              "reg_cap_currency": "人民币",
              "ent_type": "有限责任公司(自然人投资)",
              "reg_capital": "5000.00",
              "person_name": "王**",
              "credit_code": "91130629MA0CGK0J50",
              "ent_name": "杭州***科技有限公司",
              "position": "执行董事兼总经理",
              "ind_cat_name": "信息传输、软件和信息技术服务业",
              "establish_date": "2018-06-29",
              "person_id": "V1!i0Fxv5kw0M0Pe9Nox5ic+1oZgTfItG+D+JKBEuwbRhJPs97CJDbko46zV0HpjW0f7ISGADHTLt3k<n>/ZyJzTNriA=="
            },
            //  {
            //   "ent_status": "在营（开业）",
            //   "reg_org_province": "天津市",
            //   "reg_no": "120000400131969",
            //   "reg_cap_currency": "人民币元",
            //   "ent_type": "有限责任公司(台港澳法人独资)",
            //   "reg_capital": "180000.000000",
            //   "person_name": "王**",
            //   "credit_code": "911201165929368212",
            //   "ent_name": "天津煜东信德物流有限公司",
            //   "position": "经理",
            //   "ind_cat_name": "交通运输、仓储和邮政业",
            //   "establish_date": "2012-04-25",
            //   "person_id": "V1!i0Fxv5kw0M0Pe9Nox5ic+1oZgTfItG+D+JKBEuwbRhJPs97CJDbko46zV0HpjW0f7ISGADHTLt3k<n>/ZyJzTNriA=="
            // }, {
            //   "ent_status": "注销",
            //   "reg_org_province": "北京市",
            //   "reg_no": "110000450095527",
            //   "reg_cap_currency": "人民币元",
            //   "ent_type": "外商投资企业分公司",
            //   "reg_capital": "",
            //   "person_name": "王**",
            //   "credit_code": "",
            //   "ent_name": "北京京东世纪贸易有限公司团结湖分公司",
            //   "position": "负责人",
            //   "ind_cat_name": "批发和零售业",
            //   "establish_date": "2009-04-08",
            //   "person_id": "V1!i0Fxv5kw0M0Pe9Nox5ic+1oZgTfItG+D+JKBEuwbRhJPs97CJDbko46zV0HpjW0f7ISGADHTLt3k<n>/ZyJzTNriA=="
            // }
          ],
          "shareholder": [{
            "ent_status": "在营（开业）",
            "reg_org_province": "北京市",
            "reg_no": "3301********8632",
            "reg_cap_currency": "人民币",
            "reg_capital": "5000.00",
            "sub_fund_amount": "450.000000",
            "ent_type": "有限责任公司(自然人投资)",
            "person_name": "王**",
            "fund_form": "",
            "credit_code": "91110302MA01A23P18",
            "currency": "",
            "fund_ratio": "99.90%",
            "ent_name": "杭州***科技有限公司",
            "establish_date": "2018-01-23",
            "ind_cat_name": "批发和零售业",
            "person_id": "V1!i0Fxv5kw0M0Pe9Nox5ic+1oZgTfItG+D+JKBEuwbRhJPs97CJDbko46zV0HpjW0f7ISGADHTLt3k<n>/ZyJzTNriA=="
          }, {
            "ent_status": "在营（开业）",
            "reg_org_province": "北京市",
            "reg_no": "3301********8632",
            "reg_cap_currency": "人民币",
            "reg_capital": "5000.00",
            "sub_fund_amount": "148.500000",
            "ent_type": "有限责任公司(自然人投资)",
            "person_name": "王**",
            "fund_form": "货币",
            "credit_code": "91110302397828251C",
            "currency": "人民币元",
            "fund_ratio": "99.90%",
            "ent_name": "杭州***科技有限公司",
            "establish_date": "2014-06-17",
            "ind_cat_name": "租赁和商务服务业",
            "person_id": "V1!i0Fxv5kw0M0Pe9Nox5ic+1oZgTfItG+D+JKBEuwbRhJPs97CJDbko46zV0HpjW0f7ISGADHTLt3k<n>/ZyJzTNriA=="
          }]
        },
        work: [{
            "workHistory": {
              "id": 79,
              "sort": 1,
              "orderNo": "535832984687742976",
              "company": "***供应链有限公司",
              "companyResult": "一致",
              "companyDescription": "一致",
              "workplace": "杭州",
              "workplaceResult": "一致",
              "workplaceDescription": "撒旦撒旦撒旦撒旦",
              "period": "2011.5至2018.5",
              "periodResult": "一致",
              "periodDescription": "1",
              "pattern": "全职",
              "patternResult": "一致",
              "patternDescription": "",
              "superior": "鲁仲",
              "superiorResult": "一致",
              "superiorDescription": "部门主管",
              "position": "高级技术专家",
              "positionResult": "一致",
              "positionDescription": "",
              "duty": "未提交",
              "dutyResult": "信息平台部： 直接上级1人,同级5人,直线下属15人",
              "dutyDescription": "信息平台部： 直接上级1人,同级5人,直线下属15人",
              "salary": "50K至60K",
              "salaryResult": "一致",
              "salaryDescription": "只有2500",
              "reason": "个人原因",
              "reasonResult": "一致",
              "reasonDescription": "2222",
              "misconduct": "否",
              "arbitration": "否",
              "nonCompetition": "否",
              "employedAgain": "是",
              "createTime": 1547794240000,
              "modifyTime": 1548037261000
            },
            "workWitness": {
              "id": 122,
              "workHistoryId": 79,
              "name": "鲁仲",
              "position": "直属主管",
              "relation": "资深专家",
              "basicInfo": "5年",
              "createTime": 1547794239000,
              "modifyTime": 1547794239000
            },
            "workPerformance": {
              "id": 92,
              "workHistoryId": 79,
              "professionalAbility": "据访谈人反馈，候选人主要负责集团信息平台-系统架构部，主要职责负责集团系统网络建设和运维的自动化发展，候选人在系统网络的快速扩展和自动化运维领域表现出了很强的专业能力，在职期间对集团业务发展的支撑做成非常大的贡献，并且在该领域已经申请多个专利。",
              "cooperationAbility": "候选人所带领的团队主要职责就是研究和收集集团系统网络的运行现状，发现和预防可能存在问题点，并对业务发展做出预判，其中需要跟多方跨部门沟通协作，同时也会设计多部门共同完成的项目，在这方该候选人出了能够提出专业已经的同时，也能很好的协助其他部门解决问题。",
              "stressTolerance": "访谈对象说法是：该岗位需要主动去发 现问题并解决问题，主动承担责任，该 岗位不是上级下发任务该去做什么，而是 告诉上级和下属我们需要做什么，如果工 作积极性不够，不可能承担该岗位！",
              "workingEnthusiasm": "访谈对象说法是：该岗位需要主动去发 现问题并解决问题，主动承担责任，该 岗位不是上级下发任务该去做什么，而是 告诉上级和下属我们需要做什么，如果工 作积极性不够，不可能承担该岗位！",
              "advantageAchievements": "在该领域专业、有很强的管理和协调能力；在职5年，对集团基础设施建设自动化做出了不错的成绩，所带领团队自研的产品，为公司大大降低了人力成本，提高了资源的利用率。。",
              "shortcoming": "有点“坚持己见“，不容易被说服，总想 着说服别人，不过大部分时候他的“说法“ 占优。",
              "overallScore": "他是我比较看好的下属，我认为职场中 没有满分，给9分吧。",
              "createTime": 1547794240000,
              "modifyTime": 1548037261000
            }
          }, {
            "workHistory": {
              "id": 80,
              "sort": 2,
              "orderNo": "535832984687742976",
              "company": "***技术有限公司",
              "companyResult": "一致",
              "companyDescription": "一致",
              "workplace": "北京",
              "workplaceResult": "一致",
              "workplaceDescription": "",
              "period": "2009.5至2011.5",
              "periodResult": "一致",
              "periodDescription": "",
              "pattern": "全职",
              "patternResult": "一致",
              "patternDescription": "",
              "superior": "高翔",
              "superiorResult": "一致",
              "superiorDescription": "",
              "position": "资深工程师",
              "positionResult": "一致",
              "positionDescription": "",
              "duty": "未提交",
              "dutyResult": "北区业务支撑： 直接上级1人,同级3人,直线下属10人",
              "dutyDescription": "",
              "salary": "25K",
              "salaryResult": "一致",
              "salaryDescription": "访谈人不方便透露",
              "reason": "个人原因",
              "reasonResult": "希望往互联网技术方向发展",
              "reasonDescription": "依据连撒旦是",
              "misconduct": "否",
              "arbitration": "否",
              "nonCompetition": "否",
              "employedAgain": "是",
              "createTime": 1547794240000,
              "modifyTime": 1548037262000
            },
            "workWitness": {
              "id": 123,
              "workHistoryId": 80,
              "name": "周舟",
              "position": "直属主管",
              "relation": "北区总监",
              "basicInfo": "共事2年",
              "createTime": 1547794239000,
              "modifyTime": 1547794239000
            },
            "workPerformance": {
              "id": 92,
              "workHistoryId": 79,
              "professionalAbility": "证明人（直接上级）反馈：该候选人职责主要有北区销售团队、运营商销售团队的售前技术支撑，智慧城市项目的PM。候选人对公司产品非常熟悉，对运营商级别主流设备各项性能和了如指掌，在职期间负责多家大客户的产品培训工作。同事该候选人对售前方案及招投标流程也比较了解，在该岗位表现出很专业的工作状态。",
              "cooperationAbility": "证明人（直接上级）表示：该候选人善于寻找和利用资源，比如本团队解决不能解决或工作量上无法完成的项目，善于“借力“。或者通过构建一些流程和规范，帮助本团队提高效率或节约跨部门之间的沟通成本。对带领新人、培养帮助他们成长也有一套自己有效的方法。 HR认为：该候选人与同事之间相处很融洽，经常会组织一些培训和分享，乐于帮助他人，同事们都比较认可。",
              "stressTolerance": "证明人（直接上级）表示：该候选人善于寻找和利用资源，比如本团队解决不能解决或工作量上无法完成的项目，善于“借力“。或者通过构建一些流程和规范，帮助本团队提高效率或节约跨部门之间的沟通成本。对带领新人、培养帮助他们成长也有一套自己有效的方法。 HR认为：该候选人与同事之间相处很融洽，经常会组织一些培训和分享，乐于帮助他人，同事们都比较认可。",
              "workingEnthusiasm": "工作中能够主动承担任务，“抢活“是常态。 比如曾经非洲的一个项目，由于太远并且 地方落后，大多同事都会选择其他地方的 项目，他会选择主动承担。",
              "advantageAchievements": "带领团队协助销售完成多个大型项目 的投标中发挥了积极的作用。",
              "shortcoming": "访谈对象表示该候选人在专业方向上表 现比较突出，有较大的发展潜能，建议 往纯技术领域发展。",
              "overallScore": "8分",
              "createTime": 1547794240000,
              "modifyTime": 1548037261000
            }
          },

        ],
      })
    }
    if (options.orderno) {

      this.getallreport(options.orderno)
      this.setData({
        exmpletab: true
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