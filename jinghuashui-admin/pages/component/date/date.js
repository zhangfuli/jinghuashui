

Component({
    properties: {
        time: {
            type: Array,
            value: ["2018","01","01"]
        }
    },

    methods:{
        // 选择省市区函数
        changeRegion(e) {
            this.setData({
                time: e.detail.value.toString().split('-')
            });
            this.triggerEvent('getRegion',this.data.time)
        }
    }
})
