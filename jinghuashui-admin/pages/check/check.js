// pages/check/check.js
var WxSearch = require('../../wxSearchView/wxSearchView.js');
Page({
  data: {
      hide: false
  },
  onLoad: function (options) {
      var that = this;
      WxSearch.init(
          that,  // 本页面一个引用
           [], // 热点搜索推荐，[]表示不使用
           [],// 搜索匹配，[]表示不使用
          that.mySearchFunction, // 提供一个搜索回调函数
          that.myGobackFunction //提供一个返回回调函数
      );


  },
    wxSearchInput: WxSearch.wxSearchInput,  // 输入变化时的操作
    wxSearchKeyTap: WxSearch.wxSearchKeyTap,  // 点击提示或者关键字、历史记录时的操作
    wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
    wxSearchConfirm: WxSearch.wxSearchConfirm,  // 搜索函数
    wxSearchClear: WxSearch.wxSearchClear,  // 清空函数

    //搜索回调函数
    mySearchFunction: function (value) {
        console.log("123")
        this.setData({
            hide: !this.hide
        })
    },

    // 5 返回回调函数
    myGobackFunction: function () {
        //把所有数据清空
        this.setData({
            hide: false
        })
    }
})