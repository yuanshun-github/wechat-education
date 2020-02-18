//app.js
var common = require("pages/common/common.js");
var net = require("pages/common/net.js");
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code;
        var url = common.getCommonRequset("login");
        if (code) {
          var that = this;
          var params = { 'code': code };
          console.log(code);
          net.sendRequestCommon(url, params, that, "token");
        }
      }
    })
    
  },
  globalData: {
    userInfo: { "nickName": '未授权', 'avatarUrl': '/image/no-user.png' }
  },
  //登录成功
  handlerSuccessData: function (data,type) {
    if(type=="token"){
      console.log("登录成功：" + data.token + ";父id:" + data.type + ";userId是：" + data.userId);
      wx.setStorageSync('token', data.token);
      wx.setStorageSync('loginType', data.type);
      wx.setStorageSync("userId",data.userId);
      //查看是否授权
      var that = this;
      wx.getSetting({
        success: res => {
          console.log("授权信息返回");
          if (res.authSetting['scope.userInfo']) {
            console.log("已经授权");
            // 授权,已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                console.log("已经授权获取用户头像信息");
                this.globalData.userInfo = res.userInfo
                console.log(res.userInfo);
                var url = common.getCommonRequset("updateUserInfo");
                var userInfo = JSON.stringify(res.userInfo);
                var params = { "userInfo": userInfo, "token": data.token };
                net.sendRequestCommon(url, params, that, "updateUserInfo");
              },
              fail:res =>{
                console.log("获取头像信息失败");
              }
            })
          } else {
            // 没有授权
            console.log("没有授权");
            var userInfo = { "nickName": '未授权', 'avatarUrl': '/image/people1.png' };
            this.globalData.userInfo = userInfo;

          }
        },
        fail: res => {
          console.log("授权返回异常");
        }
      })
    }else{
      console.log("微信个人信息更新返回");
    }
    
  }
})