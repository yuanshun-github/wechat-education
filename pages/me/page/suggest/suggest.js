// pages/me/page/suggest/suggest.js
var common = require("../../../common/common.js");
var net = require("../../../common/net.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    suggest:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  subjectSuggest: function (event){
    var url = common.getCommonRequset("insertSuggest");
    var token = wx.getStorageSync("token");
    console.log(this.data.suggest);
    var data = event.detail.value;
    console.log(data);
    var params = {"token":token,"suggest":data.suggest};
    var that = this;
    net.sendRequestCommon(url, params, that,"insertSuggest");
  },
  //请求成功之后处理数据
  handlerSuccessData:function(data,type){
    if (type =="insertSuggest"){
      wx.showToast({
        title: data,
        icon: 'none'
      })
    }else{

    }
  }
})