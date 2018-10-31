// pages/service/service.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList:[
      '../../images/devices.png',
      '../../images/devices.png',
      '../../images/devices.png'
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    this.setData({
      serviceId: options.serviceid,
      cnt: options.cnt,
      isBooked: options.isBooked == 'false'? false:true,
      userid: options.userid,
      city:options.usercity
    })
    wx.request({
      url: 'http://47.99.175.99:8080/reservation/findByServiceid',
      data:{
        serviceid:that.data.serviceId
      },
      success:function(res){
        var users = []
        for(var j=0; j<res.data.length; ++j){
          var i = res.data[j]
          if(i['phone'].length >= 10)
            users.push(i['phone'][0] + i['phone'][1] + i['phone'][2] + '****' + i['phone'][7] + i['phone'][8] + i['phone'][9] + i['phone'][10])
        }
        that.setData({
          userList: users,
          userCnt: res.data.length
        })
      }
    });
    wx.request({
      url: 'http://47.99.175.99:8080/service/findOne',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data:{
        serviceid: parseInt(that.data.serviceId)
      },
      success:function(res){
        that.setData({
          name:res.data.name,
          price:res.data.price,
          details:res.data.detail,
          city:that.data.city//app.globalData.userInfo.city
        })
      }
    })
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

  },
  book:function(){
    var that = this
    if(!this.data.isBooked)
      wx.request({
        url:'http://47.99.175.99:8080/reservation/create',
        data:{
          userid:that.data.userid,
          serviceid:that.data.serviceId
        },
        method:'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success:function(res){
          var info = res.data
          console.log(info.code)
          if(info.code){
            wx.showModal({
              showCancel:false,
              title: '警告',
              content: '用户不存在或服务不存在！',
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
          else{
            that.setData({
              isBooked: true
            })
            wx.request({
              url: 'http://47.99.175.99:8080/reservation/findByServiceid',
              data: {
                serviceid: that.data.serviceId
              },
              success: function (res) {
                var users = []
                for (var j = 0; j < res.data.length; ++j) {
                  var i = res.data[j]
                  if (i['phone'].length >= 10)
                    users.push(i['phone'][0] + i['phone'][1] + i['phone'][2] + '****' + i['phone'][7] + i['phone'][8] + i['phone'][9] + i['phone'][10])
                }
                that.setData({
                  userList: users,
                  userCnt: res.data.length
                })
              }
            });
          }
        }
      })
  }
})