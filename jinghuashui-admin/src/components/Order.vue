<template>
  <div>
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
            type: 'index'
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
            sortable: true
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
              this.reservation[i].finalIsService = response.body[i].isservice == 1 ?
                response.body[i].workercard + "号师傅服务" :
                "未服务";
            }
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
            }
          }

        }
      },
      exportData (type) {
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
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
