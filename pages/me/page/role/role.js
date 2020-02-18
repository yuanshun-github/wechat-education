// pages/me/index/page/role/role.js
var common = require("../../../common/common.js");
var net = require("../../../common/net.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfoRole: false,
    userButtonTxt:"点击获取用户权限"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //查看是否授权
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 授权,已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.setData({
            userInfoRole: true,
            userButtonTxt:"已获取用户权限"
          });
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var userId = wx.getStorageSync("userId");
    console.log("开始转发");
    return {
      path: '/pages/resource/index?id=' + userId,
      success: function (res) {
        console.log('转发完成')
      },
      fail: function (res) {
        // 分享失败
        console.log('转发失败');
      }
    }
  },
  //获取用户信息
  onAuth:function(){
    var that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          console.log("授权成功");
          that.setData({
            userInfoRole: true,
            userButtonTxt: "已获取用户权限"
          });
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo;
              var url = common.getCommonRequset("updateUserInfo");
              var userInfo = JSON.stringify(res.userInfo);
              var pages = getCurrentPages();
              var parpage = pages[pages.length - 2];
              if (parpage) {
                parpage.setData({
                  nickName: res.userInfo.nickName,
                  avatarUrl: res.userInfo.avatarUrl
                })
              }
              var token = wx.getStorageSync("token");
              var params = { "userInfo": userInfo, "token": token };
              var that = this;
              net.sendRequestCommon(url, params, that, "getUserInfo");
            }
          })
        }
      }
    })
  },
  handlerSuccessData: function (data,type) {
    if (type =="getUserInfo"){
        console.log(data);
    }
  }
})