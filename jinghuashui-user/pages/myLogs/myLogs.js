// pages/myLogs/myLogs.js
import NumberAnimate from '../myLogs/use.js'
const app = getApp()
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
      url: 'http://47.99.175.99:8080/user/findByWxname',
      data:{
        wxname:nickName
      },
      success: function(res){
        var info = res.data
        if(info == ''){
          wx.showModal({
            title: '警告',
            content: '用户不存在！',
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
          console.log(info)
          that.setData({
            info_detailes: info
          })
          wx.request({
            url: 'http://47.99.175.99:8080/user/signupday',
            data:{
              userid:info['id']
            },
            success:function(data){
              that.update(data.data)
            }
          });
          wx.request({
            url: 'http://47.99.175.99:8080/statistics',
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
    var that = this
    if (this.data.info_detailes){
      wx.request({
        url: 'http://47.99.175.99:8080/statistics',
        data: {
          userid: that.data.info_detailes['id']
        },
        success: function (res) {
          that.setData({
            devices: res.data
          })
        }
      })
    }
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
  }
})