// 请求接口封装
var app = getApp();
const request = (methods, url, data, callback, errFun) => {
  wx.request({
    url: app.globalData.webUrl + url,
    method: methods,
    header: {
      'content-type': methods == 'GET' ? 'application/json' : 'application/x-www-form-urlencoded'
    },
    dataType: 'json',
    data: data,
    success: function (res) {
      callback(res.data);
    },
    fail: function (err) {
      errFun(err);
    }
  })
}


module.exports = {
  request: request
}