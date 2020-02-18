var common = require("../../../common/common.js");
var data = require("../../../common/data.js");
var net = require("../../../common/net.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deleteIndex:0,
    downloadPropress: null,
    keyword: "",
    //查看进入的入口时搜索还是查询
    sendEntrance: "",
    //上拉是否加载
    load: true,
    arrayGrade: ['清空', '1年级', '2年级', '3年级', '4年级', '5年级', '6年级', '初一', "初二", '初三'],
    indexGrade: 0,
    listGrade: [],
    arraySubject: ['清空', '数学', '语文', '英语', '化学', '物理'],
    indexSubject: 0,
    listSubject: [],
    arrayType: ['清空', '知识点', '试卷'],
    indexType: 0,
    listType: [],
    imageHeight: '',
    searchHeight: '',
    selectHeight: '',
    imageShowHeight: '',
    listTop: '',
    //进行
    begin: 0,
    resourcesArr: [
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var listGrade = data.commonData.listGrade;
    var listSubject = data.commonData.listSubject;
    var listType = data.commonData.listType;
    this.setData({
      listGrade: listGrade,
      listSubject: listSubject,
      listType: listType
    });
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
  //搜索资料
  searchResource: function (event) {
    this.setData({
      begin: 0,
      sendEntrance: "search",
      keyword: event.detail.value,
      resourcesArr: []
    });
    var url = common.getCommonRequset("searchResourceUrl");
    var token = wx.getStorageSync("token");
    var that = this;
    var params = { 'begin': 0, "keyword": event.detail.value, "token": token,"isFlag":1 };
    net.sendRequestCommon(url, params, that, "2");
  },
  // 查询资料
  selectResource: function (event) {
    this.setData({
      begin: 0,
      sendEntrance: "select",
      resourcesArr: []
    });
    var url = common.getCommonRequset("searchResourceByParams");
    var token = wx.getStorageSync("token");
    var grade = this.data.listGrade[this.data.indexGrade].title;
    var subject = this.data.listSubject[this.data.indexSubject].title;
    var type = this.data.listType[this.data.indexType].title;
    var params = { "grade": grade, "subject": subject, "type": type, "token": token, "begin": 0,"isFlag":1 };
    var that = this;
    net.sendRequestCommon(url, params, that, "selectResource");
  },
  //获取服务器传来的数据
  handlerSuccessData: function (data, type) {
    //审批通过
    if (type =="approveResource"){
      console.log("审批完成，文件id是："+data);
      wx.showToast({
        title: "操作成功",
        icon: 'none'
      })
      var resourcesArr = this.data.resourcesArr;
      resourcesArr.splice(this.data.deleteIndex, 1);
      this.setData({
        resourcesArr: resourcesArr
      })
      
    }else{
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
  handlerFailData: function (data, type) {
    console.log("hhh");
    if (type == "approveResource") {
        wx.showToast({
        title: data,
        icon: 'none'
      })
    } else {
      console.log("bug");
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
        resourcesArr[index].downId = -1;
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
        resourcesArr[index].downId = null;
        console.log("下载完成");
        that.setData({
          resourcesArr: resourcesArr
        });
      }
    })
    //下载文件取消监听
    setTimeout(function () {
      console.log("下载文件----------" + that.data.resourcesArr[index].downId);
      if (that.data.resourcesArr[index].id != that.data.resourcesArr[index].downId) {
        console.log("取消下载成功");
        downloadTask.abort();
      }
    }, 1000)

  },
  //取消下载
  downloadCancel: function (event) {
    var index = event.target.dataset.i;
    var resourcesArr = this.data.resourcesArr;
    resourcesArr[index].downId = null;
    console.log("取消下载");
    this.setData({
      resourcesArr: resourcesArr
    })
  },
  //审批通过
  approveResource: function (event){
    var id = event.target.dataset.i;
    var index = event.target.dataset.z;
    this.setData({
      deleteIndex : index,
    })
    var isFlag = event.target.dataset.j;
    console.log("审批通过的题：" + id + "状态是：" + isFlag);
    var url = common.getCommonRequset("approvePass");
    var token = wx.getStorageSync("token");
    var params = { "token": token, "id": id, "isFlag": isFlag};
    var that = this;
    net.sendRequestCommon(url,params,that,"approveResource");
  }
})