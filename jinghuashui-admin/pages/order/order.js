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
                    if (res == null || res.data == null) {
                        $Toast({
                            content: '网络请求失败',
                            type: 'error'
                        });
                        return;
                    } else {
                        that.setData({
                            record: res.data
                        })
                        console.log(res)
                        console.log(that.data.record)
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

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})