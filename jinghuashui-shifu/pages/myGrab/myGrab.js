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
        phone: "",
        reservationid:"",
        serviceprice: "",
        showNum: 0,    //显示的我的抢单的数量(未支付、未服务)
        index: ''
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
    onShow(){
        this.getAllInfo()
    },
    onPullDownRefresh: function(){
        wx.showNavigationBarLoading() //在标题栏中显示加载
        this.getAllInfo()
    },
    //搜索回调函数
    mySearchFunction: function (value) {
        this.setData({
            phone: value,
            showNum: 0
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
                        for(let index in res.data){
                            res.data[index].finalName = res.data[index].name.substring(0,1) +
                                (res.data[index].type == '男'? '先生':'女士')
                            if(res.data[index].isservice + res.data[index].ispay < 2){
                                that.setData({
                                    showNum: that.data.showNum + 1
                                })
                            }
                        }
                        that.setData({
                            reservation: res.data
                        })
                    } else {
                        $Toast({
                            content: '用户未预约',
                            type: 'error'
                        });
                        that.setData({
                            reservation: []
                        })
                    }

                }
            }
        })
    },
    myGobackFunction: function () {
        this.setData({
            reservation: []
        });
        this.getAllInfo()
    },

    //拿到我的抢单
    getAllInfo(){
        var that = this;
        that.setData({
            showNum: 0
        });
        if(app.globalData.user){
            wx.request({
                url: app.globalData.URL + "reservation/findbyworkercard?workercard=" + app.globalData.user.card,
                complete: function (res) {
                    wx.hideNavigationBarLoading();
                    wx.stopPullDownRefresh();
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
                                if(res.data[index].isservice + res.data[index].ispay < 2){
                                    that.setData({
                                        showNum: that.data.showNum + 1
                                    })
                                }
                            }
                            that.setData({
                                reservation: res.data,
                            });
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
    confirm(event) {
        var that = this
        var reservationid = event.currentTarget.dataset.reservationid
        var serviceprice = event.currentTarget.dataset.serviceprice
        var index = event.currentTarget.dataset.index
        that.setData({
            serviceprice: serviceprice,
            imgsrc: "../../images/" + serviceprice + ".png",
            modalHidden: false,
            reservationid: reservationid,
            index: index
        });

        wx.request({
            url: app.globalData.URL + "reservation/service",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: util.json2Form({
                reservationid: reservationid,
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
    confirmservice(event){
        var that = this;
        var reservationid = event.currentTarget.dataset.reservationid
        var index = event.currentTarget.dataset.index
        wx.request({
            url: app.globalData.URL + "reservation/service",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: util.json2Form({
                reservationid: reservationid,
                workerid: app.globalData.user.id
            }),
            complete: function (res) {
                if (res == null || res.data == null) {
                    $Toast({
                        content: '网络请求失败',
                        type: 'error'
                    });
                    return;
                }else{
                    $Toast({
                        content: '提交成功',
                        type: 'success'
                    });
                    var reservation = that.data.reservation
                    reservation.splice(index, 1)
                    that.setData({
                        reservation: reservation,
                        showNum: that.data.showNum - 1
                    })
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
        this.getAllInfo()
    },
    pay(e){
        var that = this;
        var reservationid = e.target.dataset.reservationid
        var index = e.target.dataset.index
        wx.request({
            url: app.globalData.URL + "reservation/pay",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: util.json2Form({
                reservationid: reservationid,
            }),
            complete: function (res) {
                if (res.data.code == -1) {
                    $Toast({
                        content: '网络请求失败',
                        type: 'error'
                    });
                    return;
                }else{
                    // that.cancel();
                    $Toast({
                        content: '支付成功',
                        type: 'success'
                    });
                    var reservation = that.data.reservation;
                    reservation.splice(that.data.index, 1)
                    that.setData({
                        reservation: reservation,
                        showNum: that.data.showNum - 1,
                        modalHidden: true
                    });
                    return;
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
    },
    tel(event){
        wx.showModal({
            title: '拨打业主电话',
            content: event.currentTarget.dataset.phone,
            success (res) {
                if (res.confirm) {
                    wx.makePhoneCall({
                        phoneNumber: event.currentTarget.dataset.phone
                    })
                }
            }
        })
    }
});