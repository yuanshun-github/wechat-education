// pages/textbook/textbook.js
var common = require("../../../common/common.js");
var data = require("../../../common/data.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileName: "",
    filePath: "",
    arrayGrade: ['清空', '1年级', '2年级', '3年级', '4年级', '5年级', '6年级', '初一', "初二", '初三'],
    indexGrade: 0,
    listGrade: [],
    arraySubject: ['清空', '数学', '语文', '英语', '化学', '物理'],
    indexSubject: 0,
    listSubject: [],
    arrayArea: ['地区', '太原'],
    indexArea: 0,
    listArea: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var listGrade = data.commonData.listGrade;
    var listSubject = data.commonData.listSubject;
    var listArea = data.commonData.listArea;
    listGrade[0].name = "请选择";
    listSubject[0].name = "请选择";
    listArea[0].name = "请选择";
    this.setData({
      listGrade: listGrade,
      listSubject: listSubject,
      listArea: listArea
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
  /**
   * 选择文件
   */
  selectFile: function () {
    var that = this;
    wx.chooseMessageFile({
      count: 1,
      type: 'all',
      success(res) {
        console.log(res);
        console.log(res.tempFiles[0]);
        //上传文件
        var fileName = res.tempFiles[0].name;
        var filePath = res.tempFiles[0].path;
        that.setData({
          fileName: fileName,
          filePath: filePath
        });
      }
    })
  },
  /**
   * 上传文件
   */
  uploadFile: function () {
    var filePath = this.data.filePath;
    var fileName = this.data.fileName;
    var indexGrade = this.data.indexGrade;
    var indexSubject = this.data.indexSubject;
    var indexArea = this.data.indexArea;
    var grade = this.data.listGrade[indexGrade].title;
    var subject = this.data.listSubject[indexSubject].title;
    var area = this.data.listArea[indexArea].title;
    var token = wx.getStorageSync("token");
    var url = common.getCommonRequset("uploadTextbook");
    if (fileName) {
      console.log("上传文件");
      var params = {
        'filePath': filePath, 'fileName': fileName, 'token': token, "grade": grade, "subject": subject, "area": area
      };
      //上传文件
      wx.uploadFile({
        url: url, //仅为示例，非真实的接口地址
        filePath: filePath,
        name: 'file',
        formData: params,
        success(res) {
          wx.showToast({
            title: "上传成功",
            icon: 'none'
          })
        }
      })
    } else {
      wx.showToast({
        title: '请选择文件',
        icon: 'none'
      })
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
      indexArea: e.detail.value
    })
  }
})