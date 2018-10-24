// pages/check/check.js
var WxSearch = require('../../wxSearchView/wxSearchView.js');
var util = require('../../utils/util.js');
const {$Toast} = require('../../dist/base/index');
const app = getApp()
const {$Message} = require('../../dist/base/index');

Page({
    data: {
        hide: false,
        content: false,
        reservation: [],
        modalHidden: true,
        reservationid: ''
    },
    wxSearchInput: WxSearch.wxSearchInput,  // 输入变化时的操作
    wxSearchKeyTap: WxSearch.wxSearchKeyTap,  // 点击提示或者关键字、历史记录时的操作
    wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
    wxSearchConfirm: WxSearch.wxSearchConfirm,  // 搜索函数
    wxSearchClear: WxSearch.wxSearchClear,  // 清空函数
    onLoad: function (options) {
        var that = this;
        WxSearch.init(
            that,  // 本页面一个引用
            [], // 热点搜索推荐，[]表示不使用
            [],// 搜索匹配，[]表示不使用
            that.mySearchFunction, // 提供一个搜索回调函数
            that.myGobackFunction //提供一个返回回调函数
        );
        this.setData({
            workername: app.globalData.user.name
        })
    },


    //搜索回调函数
    mySearchFunction: function (value) {
        this.setData({
            hide: !this.data.hide,
            content: !this.data.content
        })
        var that = this
        wx.request({
            url: app.globalData.URL + "reservation/findByUserPhone?phone=" + value,
            complete: function (res) {
                if (res == null || res.data == null) {
                    $Toast({
                        content: '网络请求失败',
                        type: 'error'
                    });
                    return;
                } else {
                    if (res.data.code != 0) {
                        that.setData({
                            reservation: res.data,
                            hide: !that.data.hide
                        })
                        console.log(res.data)
                    } else {
                        $Toast({
                            content: '用户未预约',
                            type: 'error'
                        });
                        that.setData({
                            hide: false,
                            content: false,
                            reservation: []
                        })
                    }

                }
            }
        })
    },
    myGobackFunction: function () {
        //把所有数据清空
        this.setData({
            hide: false,
            content: false,
            reservation: []
        })
    },
    confirm(event) {
        var that = this
        this.setData({
            modalHidden: false,
            reservationid: event.currentTarget.dataset.reservationid
        })
        wx.request({
            url: app.globalData.URL + "reservation/service",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: util.json2Form({
                reservationid: that.data.reservationid,
                workerid: app.globalData.user.id
            }),
            complete: function (res) {
                if (res == null || res.data == null) {
                    $Toast({
                        content: '网络请求失败',
                        type: 'error'
                    });
                    return;
                }
            }
        })
    },
    cancel(){
        this.setData({
            modalHidden: true
        });
        $Toast({
            content: '未支付',
            type: 'error'
        });
    },
    pay(){
        var that = this
        wx.request({
            url: app.globalData.URL + "reservation/pay",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: util.json2Form({
                reservationid: that.data.reservationid,
            }),
            complete: function (res) {
                if (res.data.code == -1) {
                    $Toast({
                        content: '网络请求失败',
                        type: 'error'
                    });
                    return;
                }else{
                    $Toast({
                        content: '支付成功',
                        type: 'success'
                    });
                    return;
                }
            }
        })
    }
});