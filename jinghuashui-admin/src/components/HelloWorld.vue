<template>
  <div>
    <div class="btnPosition">
      <Button type="primary" size="large" @click="exportData(1)">
        <Icon type="ios-download-outline"></Icon>
        导出原始数据
      </Button>
      <Button type="primary" size="large" @click="exportData(2)">
        <Icon type="ios-download-outline"></Icon>
        导出排序后的数据
      </Button>
    </div>
    <Table border :columns="columns" :data="user" ref="table"></Table>
  </div>
</template>
<script>
  import API from '../config/request';

  export default {
    data() {
      return {
        columns: [
          {
            title: '序号',
            type: 'index',
            width: 70
          },
          {
            title: '业主姓名',
            key: 'name',
            sortable: true
          },
          {
            title: '联系方式',
            key: 'phone',
            width: 130
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
          },
          {
            title: '操作',
            key: 'operation',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: "15px"
                  },
                  on: {
                    click: () => {
                      this.reservation(`${this.user[params.index].id}`)
                    }
                  }
                }, "预约滤芯")
              ]);
            }
          }
        ],
        user: []
      }
    },
    mounted() {
      this.getUser()
    },
    methods: {
      getUser() {
        var self = this
        self.$http.post(API.URL + "user/findAll", {}, {emulateJSON: true})
          .then((response) => {
            self.user = response.body
            console.log(response.body)
            for (let i in response.body) {
              self.user[i] = response.body[i];
              self.user[i].finalAddress =
                response.body[i].province + "省"
                + response.body[i].city + "市"
                + response.body[i].region + "区"
                + response.body[i].address;
              if (response.body[i].lastservice == null) {
                self.user[i].lastservice = '无记录'
              }
            }
          })
      },
      delete(phone, index) {
        var self = this
        self.$http.post(API.URL + "user/delete",
          {phone: phone},
          {emulateJSON: true})
          .then((response) => {
            if (response.body.code == 1) {
              self.$Message.info('删除成功');
              self.reservation.splice(index, 1);
            } else {
              self.$Message.info('删除失败');
            }
          })
      },
      exportData(type) {
        if (type === 1) {
          this.$refs.table.exportCsv({
            filename: '原始用户表'
          });
        } else if (type === 2) {
          this.$refs.table.exportCsv({
            filename: '排序后的用户表',
            original: false
          });
        }
      },
      reservation(index) {
        var self = this
        self.$http.post(API.URL + "reservation/create",
          {
            "userid": index,
            "serviceid": 1
          },
          {emulateJSON: true})
          .then((response) => {
            if (response.body.code == -1) {
              self.$Message.info(response.body.message);
            } else {
              self.$Message.info('预约成功');
            }
          })
          .catch((response)=>{
            this.$Message.info('网络请求失败');
          })
      }
    }
  }
</script>
<style scoped>
  .btnPosition {
    text-align: left;
    margin-bottom: 30px;
  }
</style>
