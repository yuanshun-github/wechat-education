//获取统一url字符串
function getCommonRequset(type) {
  var status = "/text";//表明是测试状态还是真实环境
  var header = "https://";
  //var ipPort = "127.0.0.1:8080";
  var obj = "";
  console.log("参数是:"+type);
  switch (type) {
    //登录
    case 'login':
      obj = header + ipPort + status+ "/user/login";
      break;
    //更新用户信息
    case 'updateUserInfo':
      obj = header + ipPort + status +"/user/updateUserInfo";
      break;
    //签到请求
    case 'signInUrl':
      obj = header + ipPort + status +"/user/signIn";
      break;
    //查看是否签到
    case 'seeSignInUrl':
      obj = header + ipPort + status +"/user/seeSignIn";
      break;
    case 'getUser':
      obj = header + ipPort + status +"/user/getUser";
      break;
    case 'uploadResourceFile':
      obj = header + ipPort + status +"/resourceFile/uploadResourceFile";
      break;
    case 'searchResourceUrl':
      obj = header + ipPort + status +"/resourceFile/searchResources";
      break;
    case 'searchResourceByParams':
      obj = header + ipPort + status +"/resourceFile/selectResourceByParams";
      break;
    case 'downloadResourceFile':
      obj = header + ipPort + status +"/resourceFile/downloadResourceFile";
      break;
    //
    case 'approvePass':
      obj = header + ipPort + status +"/resourceFile/updateResourceFileById";
      break;
    //图片加载
    case 'getShowImages':
      obj = header + ipPort + status +"/image/getShowImages";
      break;
    case 'insertSuggest':
      obj = header + ipPort + status +"/suggest/insertSuggest";
      break;
    case 'getSuggest':
      obj = header + ipPort + status +"/suggest/getSuggest";
      break;
    case 'deleteSuggestById':
      obj = header + ipPort + status +"/suggest/deleteSuggestById";
      break;
    //课件
    case 'searchTextbookUrl':
      obj = header + ipPort + status +"/textbookFile/searchTextbooks";
      break;
    case 'searchTextbookByParams':
      obj = header + ipPort + status +"/textbookFile/selectTextbookByParams";
      break;
    case 'downloadTextbookFile':
      obj = header + ipPort + status +"/textbookFile/downloadTextbookFile";
      break;
    //提交用户信息
    case 'subjectUserInfomation':
      obj = header + ipPort + status + "/user/subjectUserInfomation";
      break;
    case 'getMeRole':
      obj = header + ipPort + status + "/user/getMeRole";
      break;
    //为父加积分
    case 'setFatherId':
      obj = header + ipPort + status + "/user/setFatherId";
      break;
    //
    case 'uploadTextbook':
      obj = header + ipPort + status + "/textbookFile/uploadTextbookFile";
      break;
    default:
      break;
  }
  console.log("url是：" + obj);
  return obj;
}

//获取跳转路径
function toPathPage(type) {
  var path = "";//路径
  switch (type) {
    case 'uploadTextBook':
      path = "/pages/me/page/uploadTextbook/uploadTextbook";
      break;
    //我的信息页面
    case 'meInformation':
      path = "/pages/me/page/information/information";
      break;
    //上传文件url
    case 'uploadFile':
      path = "/pages/me/page/upload/upload";
      break;
    //权限页面
    case 'role':
      path = "/pages/me/page/role/role";
      break;
    //审核文件
    case 'approveFile':
      path = "/pages/me/page/approve/approve";
      break;
    case 'suggest':
      path = "/pages/me/page/suggest/suggest";
      break;
    case 'seeSuggest':
      path = "/pages/me/page/seeSuggest/seeSuggest";
      break;
    default:
      path = "";
      break;
  }
  console.log("参数是：" + type + ";路径是：" + path);
  wx.navigateTo({
    url: path
  })
}

//分享功能


module.exports = {
  getCommonRequset: getCommonRequset,
  toPathPage: toPathPage
}