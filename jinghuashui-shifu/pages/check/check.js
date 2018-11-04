// pages/check/check.js
//抢单
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
        phone: "",
        reservationid:"",
        serviceprice: "",
        order: 0,   //限制抢单的个数
        showNum: 0    //显示的我的抢单的数量(未支付、未服务)
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
        });
    },
    onPullDownRefresh: function(){
        wx.showNavigationBarLoading() //在标题栏中显示加载
        this.setData({
            order: 0
        });
        this.getAllInfo()
    },
    onShow(){
        this.getAllInfo()
    },
    //搜索回调函数
    mySearchFunction: function (value) {
        this.setData({
            phone: value
        });
        var that = this;
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
                            reservation: res.data
                        })
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
        this.setData({
            reservation: [],
            order: 0
        });
        this.getAllInfo()
    },
    getAllInfo(){
        var that = this;
        that.setData({
            showNum: 0
        });
        if(app.globalData.user){
            wx.request({
                url: app.globalData.URL + "reservation/findAllInfo",
                complete: function (res) {
                    console.log(res)
                    wx.hideNavigationBarLoading()
                    wx.stopPullDownRefresh()
                    if (res == null || res.data == null) {
                        $Toast({
                            content: '网络请求失败',
                            type: 'error'
                        });
                        return;
                    } else {
                        if (res.data.code != 0) {
                            for(let index in res.data){
                                res.data[index].finalName = res.data[index].name.substring(0,1) +
                                    (res.data[index].type == '男'? '先生':'女士')
                                if(res.data[index].workercard == null){
                                    res.data[index].workercard = ''
                                    if(res.data[index].isservice + res.data[index].ispay < 2){
                                        that.setData({
                                            showNum: that.data.showNum + 1
                                        })
                                    }
                                }

                            }
                            that.setData({
                                reservation: res.data,
                            });
                            console.log(that.data.showNum)
                        } else {
                            that.setData({
                                reservation: []
                            })
                        }

                    }
                }
            })
        }else{
            $Toast({
                content: '请先登录',
                type: 'warning'
            });
        }
    },
    //抢单
    grab(event){
        var reservationid = event.currentTarget.dataset.reservationid
        var index = event.currentTarget.dataset.index
        var that = this;
        wx.request({
            url: app.globalData.URL + "reservation/findbyworkercard?workercard=" + app.globalData.user.card,
            complete: function (res) {
                if (res == null || res.data == null) {
                    $Toast({
                        content: '网络请求失败',
                        type: 'error'
                    });
                    return;
                } else {
                    if (res.data.code != 0) {
                        for(let index in res.data){
                            if(res.data[index].workercard == app.globalData.user.card){
                                if(res.data[index].ispay + res.data[index].isservice == 2 ? false: true){
                                    that.setData({
                                        order: that.data.order + 1
                                    })
                                }
                            }
                        }
                    }
                    //限制每个师傅只能抢10个
                    if(that.data.order < 10){
                        that.setData({
                            order: 0
                        });
                        wx.request({
                            url: app.globalData.URL + "reservation/setworker",
                            header: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            method: "POST",
                            data: util.json2Form({
                                workercard: app.globalData.user.card,
                                reservationid: reservationid
                            }),
                            complete: function (res) {
                                //that.onPullDownRefresh();
                                if(res.data){
                                    $Toast({
                                        content: '抢单成功',
                                        type: 'success'
                                    });
                                    var reservation = that.data.reservation
                                    reservation.splice(index, 1)
                                    that.setData({
                                        reservation: reservation,
                                        showNum: that.data.showNum - 1
                                    })
                                    console.log(that.data.showNum)
                                }else{
                                    $Toast({
                                        content: '网络请求失败',
                                        type: 'error'
                                    });
                                }
                            }
                        })
                    }else{
                        $Toast({
                            content: '请先完成您的抢单',
                            type: 'error'
                        });
                        that.setData({
                            order: 0
                        });
                    }

                }
            }
        })


    },
    getUser() {
        var that = this
        wx.request({
            url: app.globalData.URL + "worker/findByWxname?wxname=" + that.data.userInfo.nickName,
            complete: function (res) {
                if (res == null || res.data == null || res.data == "") {
                    $Toast({
                        content: '未注册用户请注册',
                        type: 'error'
                    });
                    return;
                } else {
                    app.globalData.user = res.data;
                    that.setData({
                        name: res.data.name,
                        phone: res.data.phone,
                        card: res.data.card,
                        region: [res.data.province, res.data.city, res.data.region]
                    })
                }
            }
        })
    }
});