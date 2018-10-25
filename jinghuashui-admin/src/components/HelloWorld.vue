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
            key: 'lastservice',
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
              self.user = response.body
            for (let i in response.body) {
              self.user[i] = response.body[i];
              self.user[i].finalAddress =
                response.body[i].province + "省"
                + response.body[i].city + "市"
                + response.body[i].region + "区"
                + response.body[i].address;
              if(response.body[i].lastservice == null){
                self.user[i].lastservice = '无记录'
              }
            }
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
