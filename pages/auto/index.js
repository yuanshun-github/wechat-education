var app = getApp();
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfoRole: false,
    userButtonTxt: "点击获取用户权限"
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
            userButtonTxt: "已获取用户权限"
          });
        }
      }
    })
  },
  onAuth() {
    var that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          console.log("授权成功");
          that.setData({
            userInfoRole : true,
            userButtonTxt: "授权成功"
          })
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo; 
            }
          })
          
        }
      }
    })
    wx.reLaunch({
      url: '/pages/resource/index',
    })
  }
})