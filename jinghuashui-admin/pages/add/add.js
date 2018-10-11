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
    },
    onLoad: function () {    // 调用函数时，传入new Date()参数，返回值是日期和时间
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
    }
})
