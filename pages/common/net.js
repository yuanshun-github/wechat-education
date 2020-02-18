var common = require("common.js");
//发送请求
function sendRequestCommon(url, params, that, type) {
  wx.request({
    url: url,
    data: params,
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT json 
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    success: function (res) {
      console.log(type+":成功返回");
      console.log(res.data);
      //回调处理
      if (res.data.status == 200 || res.data.status=="200") {
        console.log("状态status为：200,开始处理返回的数据");
        if(type!=""){
          that.handlerSuccessData(res.data.data, type);
        }
      } else if (res.data.status == 10000||res.data.status=="10000") {
        console.log("过期的url:"+url);
        console.log("状态status为：10000，需要重新登录");
        //token过期的情况
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              var code = res.code;
              var url = common.getCommonRequset("login");
              if (code) {
                var params = { 'code': code };
                sendRequestLogin(url, params);
              }
            }
          })
      } else {
        console.log("状态status为："+res.data.status+";请查找原因");
      }

    },
    fail: function (error) {
      console.log("网络异常");
      that.handlerFailData(params,type);
    },
    complete: function (res) {
      if (type == "3") {
        that.handlerCompleteData();
      }
    }
  })
}


function sendRequestLogin(url, params) {
  wx.request({
    url: url,
    data: params,
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT json 
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    success: function (res) {
      console.log("过期token补录登录成功");
      wx.setStorageSync('token', res.data.data.token);
      wx.setStorageSync('loginType', res.data.data.type);
    },
    fail: function (error) {

    },
    complete: function (res) {
      console.log("最终");
    }
  })
}




module.exports = {
  sendRequestCommon: sendRequestCommon
}