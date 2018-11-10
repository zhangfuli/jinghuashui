Component({
    data: {
        // region: ["北京市", "北京市", "东城区"],
    },
    methods:{
        // 选择省市区函数
        changeRegion(e) {
            this.setData({ region: e.detail.value });
            this.triggerEvent('getRegion',this.data.region)
        }
    },
    properties:{
      region:{
        type:Array,
        value: ["北京市", "北京市", "东城区"],
      },
      canChoose:{
        type: Boolean,
        value:true
      }
    }
})
