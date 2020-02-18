var common = require("../../../common/common.js");
var net = require("../../../common/net.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    load : true,
    begin:0,
    daleteIndex:0,
    suggestList:[
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var url = common.getCommonRequset("getSuggest");
    var token = wx.getStorageSync("token");
    var params = {"token":token,"begin":this.data.begin};
    var that = this;
    net.sendRequestCommon(url,params,that,"getSuggest");
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
    var token = wx.getStorageSync("token");
    var that = this;
    //判断是否可以加载
    if (this.data.load) {
      //提示加载
      wx.showLoading({
        title: 'loading...',
        icon: 'loading'
      })
    }
    var url = common.getCommonRequset("getSuggest");
    var params = {"token":token,"begin":this.data.begin};
    var that = this;
    net.sendRequestCommon(url, params, that,"getSuggest");
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
  deleteSuggest:function(event){
    var index = event.target.dataset.j;
    this.setData({
      daleteIndex:index
    });
    var id = event.target.dataset.i;
    var url = common.getCommonRequset("deleteSuggestById");
    var token = wx.getStorageSync("token");
    var params = {"token":token,"id":id};
    var that = this;
    net.sendRequestCommon(url, params, that,"deleteSuggestById");
  },
  //请求成功之后处理数据
  handlerSuccessData: function (data, type) {
    if (type =="getSuggest"){
      //按钮解除
      wx.hideLoading();
      var length = this.data.begin + data.length;
      var load=this.data.load;
      var suggestList = this.data.suggestList;
      for (var i = 0; i < data.length; i++) {
        suggestList.push(data[i]);
        load = true;
      }
      if(data.length==0){
        load = false;
      };
      this.setData({
        suggestList: suggestList,
        begin:length,
        load:load
      })
    } else if (type =="deleteSuggestById"){
      console.log(this.data.daleteIndex);
      var suggestList = this.data.suggestList;
      suggestList.splice(this.data.daleteIndex,1);
      this.setData({
        suggestList:suggestList
      })
    }
  }
})