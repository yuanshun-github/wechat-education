
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp();

Page({
  data: {
    textItem:{
      tt:"hello world"
    },
    tabs: ["能效看板", "设备看板"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    // 搜索框状态
    inputShowed: true,
    //显示结果view的状态
    viewShowed: false,
    // 搜索框值
    inputVal: "",
    //搜索渲染推荐数据
    list: [],
  },
  onLoad: function () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 授权,已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          console.log("tab页面已经授权");
        } else {
          // 没有授权
          console.log("没有授权");
          wx.navigateTo({
            url: "/pages/auto/index"
          })
        }
      }
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  // 隐藏搜索框样式
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  // 清除搜索框值
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  // 键盘抬起事件
  inputTyping: function (e) {
    console.log(e.detail.value)
    var that = this;
    if (e.detail.value == '') {
      return;
    }
    that.setData({
      viewShowed: false,
      inputVal: e.detail.value
    });

    //随便写几个单词作为检索后的结果集
    that.setData({
      list: [{
        "deviceId": "001",
        "name": "abcaaaaaaaa"
      },
      {
        "deviceId": "002",
        "name": "bcdaaaaaaaaa"
      },
      {
        "deviceId": "003",
        "name": "cde"
      },
      {
        "deviceId": "004",
        "name": "def"
      },
      {
        "deviceId": "005",
        "name": "efg"
      }]
    })
  },
  // 获取选中推荐列表中的值
  btn_name: function (res) {
    var that = this;
    that.hideInput();
    console.log('name:  ' + res.currentTarget.dataset.name);
  },
});