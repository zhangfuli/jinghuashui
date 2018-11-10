//index.js
var util = require('../../utils/util.js');


const app = getApp()
Page({
    data: {
        name:'',
        phone:'',
        address:'',
        type:'',
        visible1: false,
        purifier: [{
                name: '通电',
            }, {
                name: '未通电'
            }],
        region:[],
        time:["2018","01","01"],


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
        } else if (this.data.canIUse){
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
            console.log(123)
        } else {
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }

        var time = util.formatTime(new Date());    // 再通过setData更改Page()里面的data，动态更新页面的数据
        this.setData({
            time: time
        });
        //this.getUserInfo()
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
        console.log('点击了选项' + index)
        if(index == 1){
            this.setData({
                type: '通电'
            });
        }else if(index == 2){
            this.setData({
                type: '不通电'
            });
        }
        this.choosePurifierCancel()
    },
    getRegion(eventDetail){
        console.log(eventDetail)
    },
    getUserInfo: function(e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    postData(){
        var that = this
        wx.request({
            url: "http://op.juhe.cn/onebox/weather/query",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            //data: { cityname: "上海", key: "1430ec127e097e1113259c5e1be1ba70" },
            data: util.json2Form({
                cityname: "上海",
                key: "1430ec127e097e1113259c5e1be1ba70"
            }),
            complete: function (res) {
                that.setData({
                    // toastHidden: false,
                    // toastText: res.data.reason,
                    // city_name: res.data.result.data.realtime.city_name,
                    // date: res.data.result.data.realtime.date,
                    // info: res.data.result.data.realtime.weather.info,
                });
                if (res == null || res.data == null) {
                    console.error('网络请求失败');
                    return;
                }
            }
        })
    }
})
