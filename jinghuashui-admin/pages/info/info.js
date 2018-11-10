// pages/info/info.js
const app = getApp()
const base = app.globalData.url
Page({
  data: {
    hasUserInfo: false,
    visible1: false,
    purifier: [{
      name: '男',
    }, {
      name: '女'
    }],
    canedit: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      wxname: app.globalData.userInfo.nickName
    })
    var that = this
    wx.request({
      url: base + '/user/findByWxname',
      data: {
        wxname: this.data.userInfo.nickName
      },
      success: function(res) {
        options = res.data;
        console.log(options)
        if (options) {
          that.setData({
            name: options.name,
            phone: options['phone'],
            region: [options['province'], options['city'], options['region']],
            address: options['address'],
            type: options['type'],
            userId: options['id'],
          })
        }
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
  change: function() {
    var that = this
    var dataDe = this.data
    if (!(dataDe.name && dataDe.phone && dataDe.region.length == 3 && dataDe.address && dataDe.type)) {
      console.log(dataDe.name && dataDe.phone && dataDe.region.length == 3 && dataDe.address && dataDe.type)
      wx.showToast({
        title: '请完善信息！',
        icon: 'none',
        duration: 1000
      })
    } else {
      if (this.data.userId) {
        wx.request({
          url: base + '/user/update',
          data: {
            'userid': parseInt(that.data.userId),
            'name': that.data.name,
            'phone': that.data.phone,
            'province': that.data.region[0],
            'city': that.data.region[1],
            'region': that.data.region[2],
            'address': that.data.address,
            'type': that.data.type,
            'wxname': that.data.wxname
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          success: function(res) {
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function() {
            wx.showModal({
              title: '警告',
              content: '修改信息失败',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        })
      } else {
        wx.request({
          url: base + '/user/create',
          data: {
            // 'userid': parseInt(that.data.userId),
            'name': that.data.name,
            'phone': that.data.phone,
            'province': that.data.region[0],
            'city': that.data.region[1],
            'region': that.data.region[2],
            'address': that.data.address,
            'type': that.data.type,
            'wxname': that.data.wxname
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          success: function(res) {
            wx.showToast({
              title: '注册成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function() {
            wx.showModal({
              title: '警告',
              content: '注册失败',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        })
      }
    }

  },
  choosePurifierOpen() {
    if (this.data.canedit == false) {
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
  choosePurifierClick({
    detail
  }) {
    const index = detail.index + 1;
    console.log(this.data)
    if (index == 1) {
      this.setData({
        type: '男'
      });
    } else if (index == 2) {
      this.setData({
        type: '女'
      });
    }
    this.choosePurifierCancel()
  },
  getRegion(eventDetail) {
    this.data.region = eventDetail.detail
  },
  finishInputName(e) {
    this.data.name = e.detail.detail.value
    // console.log(e)
  },
  finishInputPhone(e) {
    this.data.phone = e.detail.detail.value
  },
  finishInputAddress(e) {
    // console.log(1111)
    this.data.address = e.detail.detail.value
  },

})