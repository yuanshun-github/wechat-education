// pages/me/page/information/information.js
var common = require("../../../common/common.js");
var net = require("../../../common/net.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:null,
    userInfoRole:false,
    noSubjectInfomation:false,
    nameItem:{
      title:"姓名",
      name:"name",
      tips:"请输入姓名",
      inputVal:"",
      isWarn:false,
      length:5
    },
    phoneItem:{
      title:"手机号",
      name:"phone",
      tips:"请输入手机号",
      inputVal: "",
      isWarn: false,
      length:11
    },
    emailItem:{
      title:"邮箱",
      name:"email",
      tips:"请输入邮箱",
      inputVal: "",
      isWarn: false,
      length: 20
    },
    addressItem:{
      title:"地址",
      name:"address",
      tips:"请输入地址",
      inputVal: "",
      isWarn: false,
      length: 50
    },
    creditItem:{
      title: "积分",
      name: "credit",
      tips: "",
      inputVal: "",
      isWarn: false,
      length: 8
    }
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
          });
        } 
      }
    })

    var url = common.getCommonRequset("getUser");
    var token = wx.getStorageSync("token");
    var params = {"token":token};
    var that = this;
    net.sendRequestCommon(url,params,that,"getUser");
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
  formSubmit:function(event){
    var data = event.detail.value;
    console.log(data);
    console.log(data.name);
    //查看姓名是否为空
    if (!data.name){
      console.log("姓名为空");
      this.setData({
        "nameItem.isWarn":true
      })
      return
    } else if(!data.phone){
      console.log("电话为空");
      this.setData({
        "phoneItem.isWarn": true
      })
      return
    } else if (!data.email) {
      console.log("邮箱为空");
      this.setData({
        "emailItem.isWarn": true
      })
      return
    }else if(!data.address){
      console.log("地址为空");
      this.setData({
        "addressItem.isWarn": true
      })
      return
    }else{
      //开始提交
      var url = common.getCommonRequset("subjectUserInfomation");
      console.log("是否是第一次更新信息："+this.data.noSubjectInfomation);
      var params = {
        "token": wx.getStorageSync("token"), "userName": data.name,
        "phone": data.phone, "email": data.email, "address": data.address, "type": this.data.noSubjectInfomation};
      var that = this;
      net.sendRequestCommon(url, params, that, "subjectUserInfomation");
    }
  },
  //成功返回的方法
  handlerSuccessData: function(data,type){
    console.log(data);
    if(type=="getUser"){
      this.setData({
        user: data
      });
      //如果没有填写个人信息，则开始填写个人信息,进入form表单
      console.log(data);
      if (!data.userName){
        this.setData({
          noSubjectInfomation:true,
        })
      }else{
        this.setData({
          "nameItem.inputVal": data.userName,
          "phoneItem.inputVal":data.phone,
          "emailItem.inputVal":data.email,
          "addressItem.inputVal":data.address,
          "creditItem.inputVal":data.credit
        })
      }
      
    } else if (type =="subjectUserInfomation"){
      wx.showToast({
        title: '提交成功',
        icon: 'none'
      })
      this.setData({
        user: data,
        "nameItem.inputVal":data.userName,
        "phoneItem.inputVal": data.phone,
        "emailItem.inputVal": data.email,
        "addressItem.inputVal": data.address,
        "creditItem.inputVal": data.credit,
        noSubjectInfomation: false,
      })
    }
  }
})