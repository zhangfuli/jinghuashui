//index.js
var util = require('../../utils/util.js');
const { $Toast } = require('../../dist/base/index');
const app = getApp()

Page({
    data: {
        name:'',
        phone:'',
        address:'',
        type:'',
        visible1: false,
        purifier: [{
                name: '男',
            }, {
                name: '女'
            }],
        region:["北京市", "北京市", "东城区"],
        time:["2018","01","01"],
        wxname:"",

        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad: function () {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
            this.getUser()
        } else if (this.data.canIUse){
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

        var time = util.formatTime(new Date());    // 再通过setData更改Page()里面的data，动态更新页面的数据
        this.setData({
            time: time
        });
    },

    choosePurifierOpen(){
      this.setData({
          visible1: true
      });
    },
    choosePurifierCancel () {
        this.setData({
            visible1: false
        });
    },
    choosePurifierClick({ detail }){
        const index = detail.index + 1;
        if(index == 1){
            this.setData({
                type: '男'
            });
        }else if(index == 2){
            this.setData({
                type: '女'
            });
        }
        this.choosePurifierCancel()
    },
    getRegion(eventDetail){
        console.log(eventDetail)
        this.data.region = eventDetail.detail
    },
    getUserInfo(e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
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
    getAddress(e){
        this.setData({
            address: e.detail.detail.value
        })
    },
    postData(){
        if(!this.data.name){
            $Toast({
                content: '姓名不能为空',
                type: 'error'
            });
            return;
        }
        if(!this.data.phone){
            $Toast({
                content: '联系方式不能为空',
                type: 'error'
            });
            return;
        }
        if(!this.data.address){
            $Toast({
                content: '详细地址不能为空',
                type: 'error'
            });
            return;
        }
        if(!this.data.type){
            $Toast({
                content: '类型不能为空',
                type: 'error'
            });
            return;
        }

        var that = this
        wx.request({
            url: app.globalData.URL + "worker/saveUser",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: util.json2Form({
                userid: "",
                name: that.data.name,
                phone: that.data.phone,
                province: that.data.region[0],
                city: that.data.region[1],
                region: that.data.region[2],
                address: that.data.address,
                type: that.data.type,
                wxname: ""
            }),
            complete: function (res) {
                console.log(res)
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
                    that.setData({
                        name: "",
                        phone: "",
                        province: "",
                        city: "",
                        region: "",
                        address: "",
                        type: "",
                        wxname: ""
                    })
                }
            }
        })
    },
    getUser() {
        var that = this
        // wx.request({
        //     url: app.globalData.URL + "worker/findByWxname?wxname=" + that.data.userInfo.nickName,
        //     complete: function (res) {
        //         console.log(res)
        //         if (res == null || res.data == null) {
        //             $Toast({
        //                 content: '网络请求失败',
        //                 type: 'error'
        //             });
        //             return;
        //         } else {
        //             app.globalData.user = res.data;
        //             that.setData({
        //                 name: res.data.name,
        //                 phone: res.data.phone,
        //                 card: res.data.card,
        //                 region: [res.data.provice, res.data.city, res.data.region]
        //             })
        //         }
        //     }
        // })
    }
})
