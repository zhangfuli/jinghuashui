// pages/myLogs/myLogs.js
import NumberAnimate from '../myLogs/use.js'
const app = getApp()
const base = app.globalData.url
Page({

  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    eye: true,
    num:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getUser:function(nickName){
    var that = this;
    console.log(nickName)
    wx.request({
      url: base + '/user/findByWxname',
      data:{
        wxname:nickName
      },
      success: function(res){
        var info = res.data
        if(info == ''){
          wx.showModal({
            title: '提醒',
            content: '用户不存在!请点击上方箭头前往注册',
            success(res) {
            }
          })
        }
        else{
          console.log(info)
          that.setData({
            info_detailes: info
          })
          wx.request({
            url: base + '/user/signupday',
            data:{
              userid:info['id']
            },
            success:function(data){
              that.update(data.data)
            }
          });
          wx.request({
            url: base + '/statistics',
            data:{
              userid: info['id']
            },
            success:function(res){
              that.setData({
                devices:res.data
              })
            }
          })
        }
      }
    })
  },
  onLoad: function(options) {

    this.getInfo()
    //获取信息
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  update:function(num) {
    
    this.setData({
      num1: '',
      num2: '',
      num3: '',
      num1Complete: '',
      num2Complete: '',
      num3Complete: ''
    });

    let num1 = num;
    let n1 = new NumberAnimate({
      from: num1,//开始时的数字
      speed: 150*num1,// 总时间
      refreshTime: 150,// 刷新一次的时间
      decimals: 0,//小数点后的位数
      onUpdate: () => {//更新回调函数
        this.setData({
          num1: n1.tempValue
        });
      },
    })

  },
  getUserInfoFun: function () {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        that.getUser(res.userInfo.nickName)
        app.globalData.userInfo = res.userInfo
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          eye: true
        })
      },
      fail: wx.navigateBack({
        delta: 0
      })
    })
  },
  getInfo:function(){
    if (app.globalData.userInfo) {
      this.getUser(app.globalData.userInfo.nickName)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    else if (this.data.canIUse) {
      this.canIUse = false;
      var that = this;
      var doit = true;
      app.userInfoReadyCallback = res => {
          app.globalData.userInfo = res.userInfo;
          this.getUser(res.userInfo.nickName)
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
          })
        };
    }
    var that = this
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          wx.showModal({
            cancelText:'我不同意',
            confirmText:'我同意',
            cancelColor: '#DC143C',
            title: '用户使用条款协议',
            content: '你需要同意这些才能使用',
            success(res) {
              if (res.cancel) {
                wx.navigateBack({
                  delta:1,
                })
              }
            }
          })
          that.setData({
            eye:false
          })
        }
      }
    })
  },
  changeDate:function(s){
    return s.split(' ')[0]
  },
  waiter:function(){
    wx.makePhoneCall({
      phoneNumber: '13002575031' //仅为示例，并非真实的电话号码
    })

  }
})