<template>
  <div>
    <Table border :columns="columns" :data="user"></Table>
  </div>
</template>
<script>
  import API from '../config/request';
  export default {
    data () {
      return {
        columns: [
          {
            title: '姓名',
            key: 'name',
            sortable: true
          },
          {
            title: '联系方式',
            key: 'phone'
          },
          {
            title: '地址',
            key: 'finalAddress',
            sortable: true
          },
          {
            title: '上次换芯时间',
            key: 'finalTime',
            sortable: true
          }
        ],
        user: []
      }
    },
    mounted(){
      this.getUser()
    },
    methods:{
      getUser(){
        var self = this
        self.$http.post(API.URL + "user/findAll",{}, {emulateJSON: true})
          .then((response) => {
            console.log(response.body)
              self.user = response.body
            for (let i in response.body) {
              self.user[i] = response.body[i];
              self.user[i].finalAddress =
                response.body[i].province + "省"
                + response.body[i].city + "市"
                + response.body[i].region + "区"
                + response.body[i].address;
              // self.user[i].finalTime =
              //   response.body[i].year + "年"
              //   + response.body[i].month + "月"
              //   + response.body[i].day + "日";



            }
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
