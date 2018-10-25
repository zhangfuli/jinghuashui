// pages/order/order.js
var util = require('../../utils/util.js');
const {$Toast} = require('../../dist/base/index');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        name1: "2018-01-01",
        day:"",
        month: "",
        year: "",
        record: []

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        if (app.globalData.user) {
            wx.request({
                url: app.globalData.URL + "record/findByWorkerid?workerid=" + app.globalData.user.id,
                complete: function (res) {
                    console.log(res.data)
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
    }
})