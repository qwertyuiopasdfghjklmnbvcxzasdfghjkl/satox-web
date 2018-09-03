<!-- OTC异常预警 -->
<template>
  <div>
    <Card>
      <p slot="title">OTC异常预警
            <Button type="primary" @click="reshAll">刷新</Button>
      </p>
      <Row>
          <Col span="12">待处理异常预警数：{{this.data2.waitHandleAmount}}</Col>
          <Col span="12">日新增预警数：{{this.data2.dailyIncreaseAmount}}</Col>
      </Row>
      <Checkbox v-model="single" @on-change = "curPage=1;getAbnormalInfo1()">显示所有异常</Checkbox>
      <Table :columns="columns1" :data="data1"></Table>
      <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
    </Card>
  </div>
</template>

<script>
import util from '../../libs/util';
import otcApi from '../../api/otcAberrant'
import detail from './detail'
export default {
  data () {
    return {
      curPage: 1,
      total: 0,
      single: false,
       columns1: [
          {
              title: '异常编号',
              key: 'abnormalNumber'
          },
          {
              title: '异常原因',
              key: 'abnormalReason'
          },
          {
              title: '订单编号',
              key: 'orderNumber'
          },
          {
              title: '币种',
              key: 'symbol'
          },
          {
              title: '金额',
              key: 'currencyAmount',
              render: (h, params) => {
                  return h ('div', [params.row.currencyAmount, 'CNY'])
              }
          },
          {
              title: '超时时间',
              key: 'surplus_Time',
               render: (h, params) => {
                    return h('div', (params.row.surplus_Time));
                }
          },
          {
              title: '订单时间',
              key: 'orderTime'
          },
          {
              title: '状态',//0,未处理， 2:已忽略
              key: 'status',
              render: (h, params) => {
                  return h ('div', params.row.status === 0 ? '未处理': '已忽略')
              }
          },
          {
              title: '操作',
              key: 'opreat',
              render: (h, params) => {
                return h('div', [
                    h('Button', {
                        props: {type: 'primary', size: 'small'},
                        style: {marginRight: '10px'},
                        on: {
                            click: () => {
                                 util.setDialog(detail, {
                                     orderId: params.row.orderId
                                 })
                                // otcApi.findOtcOrderInfo({
                                //     orderNumber: params.row.orderNumber
                                // }, (res) => {
                                //     this.$Message.success({content: '成功'})
                                // })
                            }
                        }
                    }, '查看订单详情'),
                    h('Button', {
                        props: {type: 'primary', size: 'small', disabled: params.row.status === 1},
                        style: {marginRight: '10px'},
                        on: {
                            click: () => {
                                otcApi.handleAbnormal({
                                    abnormalId: params.row.abnormalId
                                }, (res) => {
                                    this.$Message.success({content: '已处理'})
                                    this.getAbnormalInfo1()
                                })
                            }
                        }
                    }, '处理')
                ]);
            }
          }
      ],
      data1: [],
      data2: []
    }
  },
  created() {
      this.getAbnormalInfo1()
      this.getList()
  },
  methods: {
      reshAll () {
          this.getAbnormalInfo1()
          this.getList()
      },
      getList () {
          otcApi.abnormalInfo((res) => {
              this.data2 = res.data
          })
      },
      getAbnormalInfo1 () {
        if (this.single) {
            otcApi.findOtcAbnormalInfo(this.curPage, {
                displayAll: true
            }, (res, total) => {
                 res.forEach((item, index) => {
                    if (item.orderPayTime !== null) {
                        let date = util.formatDate(item.orderPayTime).getTime()
                        let ndate = util.formatDate(item.systemDate).getTime()
                        var diffTime = Math.floor((ndate - date) / 1000)
                        var minutes = Math.floor(diffTime/60)
                        var day = Math.floor((minutes/60)/24)
                        var hour = Math.floor(diffTime/60) - Math.floor(day * 24 * 60)
                        item.surplus_Time = day + '天' + Math.floor(hour/60) + '时' + minutes%60 + '分' + diffTime%60 + '秒'
                        // item.surplus_Time = Math.floor(minutes/60) + '时' + minutes%60 + '分' + diffTime%60 + '秒'
                    } else {
                        item.surplus_Time = '0天0时0分0秒'
                    }
                    
                })
                this.total = total
                this.data1 = res
            })
        } else {
            otcApi.findOtcAbnormalInfo(this.curPage, {
                displayAll: false
            },(res, total) => {
                res.forEach((item, index) => {
                        if (item.orderPayTime !== null) {
                            let date = util.formatDate(item.orderPayTime).getTime()
                            let ndate = util.formatDate(item.systemDate).getTime()
                            var diffTime = Math.floor((ndate - date) / 1000)
                            var minutes = Math.floor(diffTime/60)
                            var day = Math.floor((minutes/60)/24)
                            var hour = Math.floor(diffTime/60) - Math.floor(day * 24 * 60)
                            item.surplus_Time = day + '天' + Math.floor(hour/60) + '时' + minutes%60 + '分' + diffTime%60 + '秒'
                        } else {
                            item.surplus_Time = '0天0时0分0秒'
                        }
                        
                    })
                this.total = total
                this.data1 = res
            })
        }
      },
    //   getAbnormalInfo () {
    //       otcApi.findOtcAbnormalInfo(this.curPage, {
    //           displayAll: false
    //       },(res, total) => {
    //            res.forEach((item, index) => {
    //                 if (item.orderPayTime !== null) {
    //                     let date = util.formatDate(item.orderPayTime).getTime()
    //                     let ndate = util.formatDate(item.systemDate).getTime()
    //                     var diffTime = Math.floor((ndate - date) / 1000)
    //                     var minutes = Math.floor(diffTime/60)
    //                     var day = Math.floor((minutes/60)/24)
    //                     var hour = Math.floor(diffTime/60) - Math.floor(day * 24 * 60)
    //                     item.surplus_Time = day + '天' + Math.floor(hour/60) + '时' + minutes%60 + '分' + diffTime%60 + '秒'
    //                 } else {
    //                     item.surplus_Time = '0天0时0分0秒'
    //                 }
                    
    //             })
    //           this.total = total
    //           this.data1 = res
    //       })
    //   },
      changePage (page) {
        if (this.single) {
            this.curPage = page
            this.getAbnormalInfo1()
            return
        }
        this.curPage = page
        this.getAbnormalInfo1()
      },
    //    
  }
}
</script>

<style lang="less" scoped>
.ivu-card-head-inner, .ivu-card-head p{display: flex !important;justify-content: space-between  !important;height: 40px !important; line-height: 40px !important;}
</style>
