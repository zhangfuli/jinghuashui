// pages/info/info.js
var util = require('../../utils/util.js');
const {$Toast} = require('../../dist/base/index');
const app = getApp()

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),

        btnhide: true,
        name: "",
        phone: "",
        province: "",
        city: "",
        region: [],
        card: ""
    },

    onLoad: function (options) {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
            this.getUser()
        } else if (this.data.canIUse) {
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
                this.getUser()
            }

        } else {
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                    this.getUser()
                }
            })
        }

    },
    getName: function(e){
        this.setData({
            name: e.detail.detail.value
        })
    },
    getPhone(e){
        this.setData({
            phone: e.detail.detail.value
        })
    },
    getCard(e){
        this.setData({
            card: e.detail.detail.value
        })
    },
    getRegion(eventDetail) {
        this.data.region = eventDetail.detail
    },
    getUserInfo: function (e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
        this.getUser()
    },
    edit() {
        var that = this
        this.setData({
            btnhide: !that.data.btnhide
        })
    },
    save() {
        var that = this
        console.log(app.globalData.user)
        wx.request({
            url: app.globalData.URL + "worker/saveWorker",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: util.json2Form({
                workerid: app.globalData.user == null ? "": app.globalData.user.id,
                name: that.data.name,
                phone: that.data.phone,
                province: that.data.region[0],
                city: that.data.region[1],
                region: that.data.region[2],
                wxname: that.data.userInfo.nickName,
                card: that.data.card
            }),
            complete: function (res) {
                if (res == null || res.data == null) {
                    $Toast({
                        content: '网络请求失败',
                        type: 'error'
                    });
                    return;
                } else {
                    $Toast({
                        content: '提交成功',
                        type: 'success'
                    });
                    that.setData({
                        btnhide: !that.data.btnhide,
                    })
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
})