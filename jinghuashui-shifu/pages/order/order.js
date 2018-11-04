// pages/order/order.js
var util = require('../../utils/util.js');
const {$Toast} = require('../../dist/base/index');
const app = getApp()

Page({
    data: {
        name1: "2018-01-01",
        day:"",
        month: "",
        year: "",
        record: []

    },
    onPullDownRefresh: function(){
        wx.showNavigationBarLoading() //在标题栏中显示加载
        this.onShow()
    },
    onShow: function () {
        var that = this;
        if (app.globalData.user) {
            wx.request({
                url: app.globalData.URL + "record/findByWorkerid?workerid=" + app.globalData.user.id,
                complete: function (res) {
                    wx.hideNavigationBarLoading()
                    wx.stopPullDownRefresh()
                    if (res == null || res.data == null) {
                        $Toast({
                            content: '网络请求失败',
                            type: 'error'
                        });
                        return;
                    } else {
                        if(res.data == []){
                            $Toast({
                                content: '您尚未完成订单',
                                type: 'error'
                            });
                        }else{
                            for(let index in res.data){
                                res.data[index].finalName = res.data[index].username.substring(0,1) +
                                    (res.data[index].usertype == '男'? '先生':'女士')
                                if(res.data[index].workercard == null){
                                    res.data[index].workercard = ''
                                }
                            }
                            that.setData({
                                record: res.data
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