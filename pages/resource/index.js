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
    arrayType: ['清空', '知识点', '试卷'],
    indexType: 0,
    listType: [],
    searchHeight: '',
    selectHeight: '',
    listTop: '',
    //进行
    begin: 0,
    resourcesArr: [],
    //搜索框
    searchItem:{
      inputShowed: false,
      inputVal:""
    },
    //轮播框
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
    var that = this;
    var token = wx.getStorageSync("token");
    if(options.id){
      console.log("转发的父id" + options.id);
      if(token){
        console.log("转发进入的token："+token);
        console.log(token);
        let loginType = wx.getStorageSync("loginType");
        if (loginType == "register") {
          console.log("获取用户的登录状态是："+loginType);
          let url = common.getCommonRequset("setFatherId");
          let params = { "token": token, "fatherId": options.id };
          net.sendRequestCommon(url, params, that, "setFatherId");
        }
      }
    }
    var listGrade = data.commonData.listGrade;
    var listSubject = data.commonData.listSubject;
    var listType = data.commonData.listType;
    this.setData({
      listGrade: listGrade,
      listSubject: listSubject,
      listType: listType
    });
    //获取滚动图片
    var url = common.getCommonRequset("getShowImages");
    var params = {"type":"resource"};
    net.sendRequestCommon(url, params, that,"getShowImages");

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
        imageShowHeight: height + "px",
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
        var url = common.getCommonRequset("selectResourceUrl");
        var grade = this.data.listGrade[this.data.indexGrade].title;
        var subject = this.data.listSubject[this.data.indexSubject].title;
        var type = this.data.listType[this.data.indexType].title;
        var params = { "grade": grade, "subject": subject, "type": type, "token": token, "begin": this.data.begin, "isFlag": 0};
        net.sendRequestCommon(url, params, that, "2");
      } else {
        //用于搜索
        var url = common.getCommonRequset("searchResourceUrl");
        var params = { 'begin': this.data.begin, "keyword": this.data.keyword, "token": token, "isFlag": 0 };
        net.sendRequestCommon(url, params, that, "searchResourceByKey");
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
  //展示选择项
  showGrade: function () {
    this.setData({
      showListGrade: !this.data.showListGrade
    })
  },
  showSubject: function (event) {
    this.setData({
      showListSubject: !this.data.showListSubject
    })
  },
  showType: function (event) {
    this.setData({
      showListType: !this.data.showListType
    })
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
      indexType: e.detail.value
    })
  },
  // 查询资料
  selectResource: function (event) {
    this.setData({
      begin: 0,
      sendEntrance: "select",//状态是查询
      resourcesArr: []
    });
    wx.showLoading({
      title: '加载中',
    })
    var url = common.getCommonRequset("searchResourceByParams");
    var token = wx.getStorageSync("token");
    var grade = this.data.listGrade[this.data.indexGrade].title;
    var subject = this.data.listSubject[this.data.indexSubject].title;
    var type = this.data.listType[this.data.indexType].title;
    var params = { "grade": grade, "subject": subject, "type": type, "token": token, "begin": 0, "isFlag": 0 };
    var that = this;
    net.sendRequestCommon(url, params, that, "selectResource");
  },
  //获取服务器传来的数据
  handlerSuccessData: function (data,type) {
    if (type =="getShowImages"){
      this.setData({
        "swiperItem.imgUrls":data
      });
    } else if (type =="setFatherId"){
      console.log("转发进入的数据");

    } else if (type =="setFatherId"){
      console.log("转发过来的数据");
    }
    else{
      wx.hideLoading();
      //如果为空
      if (data) {
        console.log(data);
        //判断数据长度
        var begin = this.data.begin;
        var length = data.length;
        var resourcesArr = this.data.resourcesArr;

        //如果没有数据就以后不加载
        if (length == 0) {
          this.setData({
            load: false
          });
        } else {
          for (var i = 0; i < length; i++) {
            resourcesArr.push(data[i]);
          }
          begin = begin + length;
          this.setData({
            resourcesArr: resourcesArr,
            begin: begin
          });
        }

      } else {
        console.log("没有数据");
        this.setData({
          begin: 0,
          resourcesArr: []
        });
      }
    }
    
  },
  //获取用户请求
  handlerFailData: function (data,type) {
    if(type==""){

    }else{
      wx.hideLoading();
    }
    
  },
  //下载文件
  downloadResourceFile: function (event) {
    var token = wx.getStorageSync("token");
    var index = event.target.dataset.i;
    var resourcesArr = this.data.resourcesArr;
    var fileName = this.data.resourcesArr[index].fileName;
    var fileNameArray = fileName.split('.');
    var fileType = fileNameArray[fileNameArray.length - 1]
    var id = this.data.resourcesArr[index].id;
    var fileSize = this.data.resourcesArr[index].fileSize;
    resourcesArr[index].downId = id;
    this.setData({
      resourcesArr: resourcesArr
    });
    var path = "/" + this.data.resourcesArr[index].grade + "/" + this.data.resourcesArr[index].subject + "/" + fileName + id;
    var url = common.getCommonRequset("downloadResourceFile");
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
            resourcesArr[index].downId = -1;
            that.setData({
              resourcesArr: resourcesArr
            });
          }
        })

      },
      fail({ errMsg }) {
        console.log('downloadFile fail, err is:', errMsg)
        var resourcesArr = that.data.resourcesArr;
        that.setData({
          resourcesArr: resourcesArr
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
        console.log("下载完成");
        that.setData({
          resourcesArr: resourcesArr
        });
      }
    })
    //下载文件取消监听
    setTimeout(function () {
      // console.log("下载文件----------" + that.data.resourcesArr[index].downId);
      // if (that.data.resourcesArr[index].id != that.data.resourcesArr[index].downId) {
      //   console.log("取消下载成功");
      //   downloadTask.abort();
      // }
    }, 1000)

  },
  //取消下载
  downloadCancel: function (event) {
    var index = event.target.dataset.i;
    var resourcesArr = this.data.resourcesArr;
    //resourcesArr[index].downId = null;
    console.log("取消下载");
    this.setData({
      resourcesArr: resourcesArr
    })
  },
  showInput:function(){
    console.log("展示input框");
    this.setData({
      "searchItem.inputShowed" : true
    });
  },
  hideInput:function(){
    console.log("隐藏input框");
    this.setData({
      "searchItem.inputShowed": false
    });
  },
  //键盘抬起事件，可以设计联想的思路
  inputTyping:function(){
    console.log("键盘抬起的事件");

  },
  //搜索资料selectResource
  searchResource: function (event) {
    console.log("搜索关键词");
    if(event.detail.value){
      console.log("关键词是：" + event.detail.value);
      this.setData({
        begin: 0,
        sendEntrance: "search",//状态是搜索
        "searchItem.inputVal": event.detail.value,
        resourcesArr: []
      });
      wx.showLoading({
        title: '加载中',
      })
      var url = common.getCommonRequset("searchResourceUrl");
      var token = wx.getStorageSync("token");
      var that = this;
      var params = { 'begin': 0, "keyword": event.detail.value, "token": token, "isFlag": 0 };
      net.sendRequestCommon(url, params, that, "2");
    }else{
      console.log("关键词为空");
    }
    
  }
})