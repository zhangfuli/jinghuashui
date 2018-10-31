// pages/info/info.js
const app = getApp()
Page({
  data: {
    hasUserInfo: false,
    visible1: false,
    purifier: [{
      name: '通电',
    }, {
      name: '未通电'
    }],
    canedit:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    var that = this
    wx.request({
      url: 'http://47.99.175.99:8080/user/findByWxname',
      data: {
        wxname: this.data.userInfo.nickName
      },
      success: function (res) {
        options = res.data;
        console.log(options)
        that.setData({
          name: options.name,
          phone: options['phone'],
          region: [options['province'], options['city'], options['region']],
          address: options['address'],
          type: options['type'],
          userId: options['id'],
          wxname: options['wxname']
        })
      }
    })
    
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
  change: function () {
    var that = this
    if(!this.data.canedit){
      wx.request({
        url: 'http://47.99.175.99:8080/user/update',
        data:{
          'userid':parseInt(that.data.userId),
          'name':that.data.name,
          'phone':that.data.phone,
          'province':that.data.region[0],
          'city': that.data.region[1],
          'region':that.data.region[2],
          'address':that.data.address,
          'type':that.data.type,
          'wxname':that.data.wxname
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method:"POST",
        success:function(res){
          
        }
      })
    }
    this.setData({
      canedit: !this.data.canedit
    })

  },
  choosePurifierOpen() {
    if(this.data.canedit == false){
      this.setData({
        visible1: true
      });
    }
  },
  choosePurifierCancel() {
    this.setData({
      visible1: false
    });
  },
  choosePurifierClick({ detail }) {
    const index = detail.index + 1;
    console.log(this.data)
    if (index == 1) {
      this.setData({
        type: '通电'
      });
    } else if (index == 2) {
      this.setData({
        type: '不通电'
      });
    }
    this.choosePurifierCancel()
  },
  getRegion(eventDetail) {
    this.data.region = eventDetail.detail
  },
  finishInputName(e){
    this.data.name = e.detail.detail.value
    // console.log(e)
  },
  finishInputPhone(e) {
    this.data.phone = e.detail.detail.value
  },
  finishInputAddress(e) {
    this.data.address = e.detail.detail.value
  },
  
  })