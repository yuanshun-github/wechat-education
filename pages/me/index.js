// pages/me/index/index.js
var common = require("../common/common.js");
var net = require("../common/net.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    signIn:"签到",
    nickName: "未授权",
    avatarUrl: "/image/no-user.png",
    menuList: [
      {
        title: "个人信息",
        name: "meInformation",
        image: "green_tri.png"
      },
      {
        title: "上传资料",
        name: "uploadFile",
        image: "green_tri.png"
      },
      {
        title: "权限管理",
        name: "role",
        image: "green_tri.png"
      },
      {
        title: "用户反馈",
        name: "suggest",
        image: "green_tri.png"
      },
      {
        title: "查看用户反馈",
        name: "seeSuggest",
        image: "green_tri.png"
      },
      {
        title: "审核文件",
        name: "approveFile",
        image: "green_tri.png"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //查看签到信息
    this.seeSignIn();
    //获取权限信息
    this.getMeRole();
    if(app.globalData.userInfo){
      this.setData({
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl
      })
    }
    
    
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
  //页面跳转功能
  meFunc: function (event) {
    var name = event.target.dataset.i;
    common.toPathPage(name);
  },
  //获取用户的权限，同时更新用户名
  getMeRole: function () {
    var url = common.getCommonRequset("getMeRole");
    var token = wx.getStorageSync("token");
    var that = this;
    var params = { "token": token };
    net.sendRequestCommon(url, params, that, "getMeRole");

  },
  //获取微信授权
  handlerSuccessData2: function (data) {
    this.setData({
      menuList: data
    })
  },
  handlerFailData: function (data) {
    wx.showToast({
      title: '微信无授权',
      icon: 'none'
    })
  },
  //签到调用的方法
  signIn:function(){
    var url = common.getCommonRequset("signInUrl");
    var that = this;
    var token = wx.getStorageSync("token");
    var params = {"token":token};
    net.sendRequestCommon(url,params,that,"signIn");
  },
  //查看是否签到的方法
  seeSignIn:function(){
    var url = common.getCommonRequset("seeSignInUrl");
    var that = this;
    var token = wx.getStorageSync("token");
    var params = { "token": token };
    net.sendRequestCommon(url, params, that, "seeSignIn");
  },
  //请求成功返回的方法
  handlerSuccessData: function (data,type) {
    var signIn = this.signIn;
    console.log(signIn);
    if(type=="signIn"){
      signIn = "已签到";
      this.setData({
        signIn: signIn
      });
    } else if (type =="seeSignIn"){
      if (data !="没有签到"){
        signIn = "已签到";
      }
      this.setData({
        signIn: signIn
      });
    } else if (type =="getMeRole"){
        console.log("获取用户的权限");
        this.setData({
          menuList:data
        })
    }
    
  }
})