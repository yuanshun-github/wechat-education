var common = require("../common/common.js");
var data = require("../common/data.js");
var net = require("../common/net.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    downloadPropress: null,
    keyword: "",
    //查看进入的入口时搜索还是查询
    sendEntrance: "",
    //上拉是否加载
    load: false,
    arrayGrade: ['清空', '1年级', '2年级', '3年级', '4年级', '5年级', '6年级', '初一', "初二", '初三'],
    indexGrade: 0,
    listGrade: [],
    arraySubject: ['清空', '数学', '语文', '英语', '化学', '物理'],
    indexSubject: 0,
    listSubject: [],
    arrayArea: ['地区', '太原'],
    indexArea: 0,
    listArea: [],
   
    searchHeight: '',
    selectHeight: '',
   
    //进行
    begin: 0,
    textbookArr: [],
    swiperItem:{
      imageHeight: '',
      indicatorDots: true,  //小点
      autoplay: true,  //是否自动轮播
      interval: 3000,  //间隔时间
      duration: 3000,  //滑动时间
      imgUrls: [],//图片的地址
      imageShowHeight: '',//图片展示的高度
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var listGrade = data.commonData.listGrade;
    var listSubject = data.commonData.listSubject;
    var listArea = data.commonData.listArea;
    this.setData({
      listGrade: listGrade,
      listSubject: listSubject,
      listArea: listArea
    });
    //获取滚动图片
    var url = common.getCommonRequset("getShowImages");
    var params = { "type": "textbook" };
    var that = this;
    net.sendRequestCommon(url, params, that, "getShowImages");

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //修改样式，动态将页面加载
    var that = this;
    var obj = wx.createSelectorQuery();
    obj.select('.header-images').boundingClientRect().exec(function (rect) {
      console.log(rect[0].width);
      var height = rect[0].width * 0.6;
      that.setData({
        "swiperItem.imageHeight": height + "px",
        searchHeight: 0.22 * height + "px",
        selectHeight: 0.13 * height + "px",
        listTop: 1.44 * height + "px"
      })
    });

    obj.select('.iamge-show').boundingClientRect().exec(function (rect) {
      var height = rect[0].width * 0.6;
      that.setData({
        "swiperItem.imageShowHeight": height + "px",
      })
    });

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
    console.log(this.data.load);
    //提示加载
    if (this.data.load) {
      wx.showLoading({
        title: 'loading...',
        icon: 'loading'
      })
      //判断用于
      if (this.data.sendEntrance == "select") {
        //用于查询
        var url = common.getCommonRequset("searchTextbookByParams");
        var grade = this.data.listGrade[this.data.indexGrade].title;
        var subject = this.data.listSubject[this.data.indexSubject].title;
        var area = this.data.listArea[this.data.indexArea].title;
        var params = { "grade": grade, "subject": subject, "area": area, "token": token, "begin": this.data.begin, "isFlag": 0 };
        net.sendRequestCommon(url, params, that, "searchTextbookByParams");
      } else {
        //用于搜索
        var url = common.getCommonRequset("searchTextbookUrl");
        var params = { 'begin': this.data.begin, "keyword": this.data.keyword, "token": token, "isFlag": 0 };
        net.sendRequestCommon(url, params, that, "searchTextbookUrl");
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
  //搜索资料
  searchResource: function (event) {
    this.setData({
      begin: 0,
      sendEntrance: "search",
      keyword: event.detail.value,
      textbookArr: []
    });
    wx.showLoading({
      title: '加载中',
    })
    var url = common.getCommonRequset("searchTextbookUrl");
    var token = wx.getStorageSync("token");
    var that = this;
    var params = { 'begin': 0, "keyword": event.detail.value, "token": token,"isFlag":0 };
    net.sendRequestCommon(url, params, that, "searchTextbookUrl");
  },
  //选择
  bindPickerChangeGrade: function (e) {
    this.setData({
      indexGrade: e.detail.value
    })
  },
  bindPickerChangeSubject: function (e) {
    this.setData({
      indexSubject: e.detail.value
    })
  },
  bindPickerChangeType: function (e) {
    this.setData({
      indexArea: e.detail.value
    })
  },
  // 查询课件
  selectTextbook: function (event) {
    this.setData({
      begin: 0,
      sendEntrance: "select",
      textbookArr: []
    });
    wx.showLoading({
      title: '加载中',
    })
    var url = common.getCommonRequset("searchTextbookByParams");
    var token = wx.getStorageSync("token");
    var grade = this.data.listGrade[this.data.indexGrade].title;
    var subject = this.data.listSubject[this.data.indexSubject].title;
    var area = this.data.listArea[this.data.indexArea].title;
    var params = { "grade": grade, "subject": subject, "area": area, "token": token, "begin": 0,"isFlag": 0};
    var that = this;
    net.sendRequestCommon(url, params, that, "searchTextbookByParams");
  },
  //获取服务器传来的数据
  handlerSuccessData: function (data,type) {
    if (type == "getShowImages") {
      this.setData({
        "swiperItem.imgUrls": data
      });
    } else {
      wx.hideLoading();
      if (data) {
        console.log(data);
        //判断数据长度
        var begin = this.data.begin;
        var length = data.length;
        var textbookArr = this.data.textbookArr;

        //如果没有数据就以后不加载
        if (length == 0) {
          this.setData({
            load: false
          });
        } else {
          for (var i = 0; i < length; i++) {
            textbookArr.push(data[i]);
          }
          begin = begin + length;
          this.setData({
            textbookArr: textbookArr,
            begin: begin
          });
        }

      } else {
        console.log("没有数据");
        this.setData({
          begin: 0,
          textbookArr: []
        });
      }
    }
  },
  //获取用户请求
  handlerFailData: function (data) {
    wx.hideLoading();
  },
  //下载文件
  downloadTextbookFile: function (event) {
    var token = wx.getStorageSync("token");
    var index = event.target.dataset.i;
    var textbookArr = this.data.textbookArr;
    var fileName = this.data.textbookArr[index].fileName;
    var fileNameArray = fileName.split('.');
    var fileType = fileNameArray[fileNameArray.length - 1]
    var id = this.data.textbookArr[index].id;
    var fileSize = this.data.textbookArr[index].fileSize;
    textbookArr[index].downId = id;
    this.setData({
      textbookArr: textbookArr
    });
    var path = "/" + this.data.textbookArr[index].grade + "/" + this.data.textbookArr[index].subject + "/" + fileName + id;
    var url = common.getCommonRequset("downloadTextbookFile");
    url = url + "?token=" + token + "&id=" + id + "&fileName=" + fileName + "&path=" + path + "&fileSize=" + fileSize;
    var that = this;
    const downloadTask = wx.downloadFile({
      url: url,
      success(res) {
        const filePath = res.tempFilePath
        console.log("文件路径:" + filePath);
        wx.openDocument({
          filePath: filePath,
          fileType: fileType,
          success: function (res) {
            console.log('打开文档成功')
          },
          fail: function (res) {
            console.log('打开失败:');
            console.log(res);
          }
        })

      },
      fail({ errMsg }) {
        console.log('downloadFile fail, err is:', errMsg)
        var textbookArr = that.data.textbookArr;
        textbookArr[index].downId = null;
        that.setData({
          textbookArr: textbookArr
        });
      }
    })
    downloadTask.onProgressUpdate((res) => {
      console.log(res.totalBytesWritten);
      var downloadPropress = parseInt(res.totalBytesWritten / fileSize * 100);
      that.setData({
        downloadPropress: downloadPropress
      });
      if (res.totalBytesWritten == fileSize) {
        textbookArr[index].downId = null;
        console.log("下载完成");
        that.setData({
          textbookArr: textbookArr
        });
      }
    })
    //下载文件取消监听
    setTimeout(function () {
      console.log("下载文件----------" + that.data.textbookArr[index].downId);
      if (that.data.textbookArr[index].id != that.data.textbookArr[index].downId) {
        console.log("取消下载成功");
        downloadTask.abort();
      }
    }, 1000)

  },
  //取消下载
  downloadCancel: function (event) {
    var index = event.target.dataset.i;
    var textbookArr = this.data.textbookArr;
    textbookArr[index].downId = null;
    console.log("取消下载");
    this.setData({
      textbookArr: textbookArr
    })
  },
  showInput: function () {
    console.log("展示input框");
    this.setData({
      "searchItem.inputShowed": true
    });
  },
  hideInput: function () {
    console.log("隐藏input框");
    this.setData({
      "searchItem.inputShowed": false
    });
  },
  //键盘抬起事件，可以设计联想的思路
  inputTyping: function () {
    console.log("键盘抬起的事件");

  }
})