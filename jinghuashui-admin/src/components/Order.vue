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
    <Table border :columns="columns" :data="reservation" ref="table"></Table>
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
            key: 'phone'
          },
          {
            title: '地址',
            key: 'finalAddress',
            sortable: true,
            width: 200
          },
          {
            title: '服务名称',
            key: 'servicename',
            sortable: true
          },
          {
            title: '服务价格',
            key: 'serviceprice',
            sortable: true
          },
          {
            title: '预约时间',
            key: 'finalTime',
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
                    size: 'small',
                    dataId: this.reservation[params.index].id
                  },
                  on: {
                    click: () => {
                      this.pay(`${this.reservation[params.index].id}`)
                    }
                  }
                }, `${this.reservation[params.index].finalIsPay}`),
              ]);
            }
          },
          {
            title: '状态',
            key: 'finalIsService',
            sortable: true
          },
          {
            title: '删除',
            key: 'delete',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    dataId: this.reservation[params.index].id
                  },
                  on: {
                    click: () => {
                      this.delete(`${this.reservation[params.index].id}`, params.index)
                    }
                  }
                }, "删除"),
              ]);
            }
          }
        ],
        reservation: []
      }
    },
    mounted() {
      this.getReservation()
    },
    methods: {
      getReservation() {
        this.$http.get(API.URL + "reservation/findAllInfo", {emulateJSON: true})
          .then((response) => {
            this.reservation = response.body
            console.log(response.body)
            for (let i in response.body) {
              this.reservation[i] = response.body[i];
              this.reservation[i].finalAddress =
                response.body[i].province + "省"
                + response.body[i].city + "市"
                + response.body[i].region + "区"
                + response.body[i].address;
              this.reservation[i].finalTime =
                response.body[i].year + "年"
                + response.body[i].month + "月"
                + response.body[i].day + "日";

              this.reservation[i].finalIsPay = response.body[i].ispay == 1 ? "已支付" : "未支付";

              this.reservation[i].finalIsService = '未服务'
              if (response.body[i].workercard) {
                this.reservation[i].finalIsService = response.body[i].workercard + '号师傅抢单'
                if (response.body[i].isservice == 1) {
                  this.reservation[i].finalIsService = response.body[i].workercard + '号师傅服务'
                }
              }
            }
          })
          .catch((response) => {
            this.$Message.info('网络请求失败');
          })
      },
      pay(index) {
        var self = this
        for (let i in self.reservation) {
          if (self.reservation[i].id == index) {
            if (self.reservation[i].ispay == 1) {
              self.$Message.info('用户已经支付');
            } else {
              self.$http.post(
                API.URL + "reservation/pay",
                {
                  reservationid: index,
                },
                {emulateJSON: true}
              ).then((response) => {
                if (response.body.id == index) {
                  self.$Message.info('支付成功');
                  self.getReservation()
                }
              })
                .catch((response) => {
                  this.$Message.info('网络请求失败');
                })
            }
          }
        }
      },
      delete(id, index) {
        var self = this
        self.$http.post(
          API.URL + "reservation/delete",
          {reservationid: id},
          {emulateJSON: true}
        ).then((response) => {
          if (response.body.id == id) {
            self.$Message.info('删除成功');
            self.reservation.splice(index, 1);
          } else {
            self.$Message.info('删除失败');
          }
        }).catch((response) => {
          this.$Message.info('网络请求失败');
        })
      },
      exportData(type) {
        if (type === 1) {
          this.$refs.table.exportCsv({
            filename: '原始订单管理表'
          });
        } else if (type === 2) {
          this.$refs.table.exportCsv({
            filename: '排序后的订单管理表',
            original: false
          });
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .btnPosition {
    text-align: left;
    margin-bottom: 30px;
  }
</style>
