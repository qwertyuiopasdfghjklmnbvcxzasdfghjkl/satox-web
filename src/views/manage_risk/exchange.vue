<!-- 币币异常预警 -->
<template>
  <div>
    <Card>
      <p slot="title">币币异常预警</p>
      <Row>
          <Col span="12">待处理异常预警数：{{this.datas.waitHandleAmount}}</Col>
          <Col span="12">日新增预警数：{{this.datas.dailyIncreaseAmount}}</Col>
      </Row>
      <Card style="margin-top:16px;">
        <p slot="title">大额提币</p>
        <Table :columns="columns1" :data="data1"></Table>
        <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
      </Card>
      <Card style="margin-top:16px;">
        <p slot="title">大额充值</p>
        <Table :columns="columns2" :data="data2"></Table>
        <Page :current="curPage1" :total="total1" @on-change="changePage1" style="text-align:center;margin-top:20px;"></Page>
      </Card>
      <Card style="margin-top:16px;">
        <p slot="title">价格异常波动</p>
        <Table :columns="columns3" :data="data3"></Table>
        <Page :current="curPage2" :total="total2" @on-change="changePage2" style="text-align:center;margin-top:20px;"></Page>
      </Card>
      <Card style="margin-top:16px;">
        <p slot="title">交易量异常波动</p>
        <Table :columns="columns4" :data="data4"></Table>
        <Page :current="curPage3" :total="total3" @on-change="changePage3" style="text-align:center;margin-top:20px;"></Page>
      </Card>
      <Card style="margin-top:16px;">
        <p slot="title">用户异常登录</p>
        <Table :columns="columns5" :data="data5"></Table>
      </Card>
      <Card style="margin-top:16px;">
        <p slot="title">高频API访问</p>
        <Table :columns="columns6" :data="data6"></Table>
      </Card>
    </Card>
  </div>
</template>

<script>
import otcApi from '../../api/otcAberrant'
export default {
  data () {
    return {
      datas: [],
      curPage: 1, 
      total: 0,
      curPage1: 1, 
      total1: 0,
      curPage2: 1, 
      total2: 0,
      curPage3: 1, 
      total3: 0,
      columns1: [
          {
              title: '用户',
              key: 'userName'
          },
          {
              title: '币种',
              key: 'symbol'
          },
          {
              title: '提币数',
              key: 'withdrawAmount'
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
                                otcApi.handleMonitoring({
                                    withdrawAbnormalId: params.row.withdrawAbnormalId
                                }, (res) => {
                                    this.$Message.success({content: '处理成功'})
                                    this.getMonitoring()
                                })
                                // util.setDialog(login_record)
                                // this.title = '编辑管理员'
                                // this.editData = params.row;
                                // this.modelShow = true
                            }
                        }
                    }, '忽略')
                ]);
            }
          }
      ],
      data1: [],
      columns2: [
          {
              title: '用户',
              key: 'userName'
          },
          {
              title: '币种',
              key: 'symbol'
          },
          {
              title: '充值数',
              key: 'rechargeAmount'
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
                                otcApi.handleRecharge({
                                    rechargeAbnormalId: params.row.rechargeAbnormalId
                                }, (res) => {
                                    this.$Message.success({content: '处理成功'})
                                    this.getAbnormalInfo()
                                })
                                // util.setDialog(login_record)
                                // this.title = '编辑管理员'
                                // this.editData = params.row;
                                // this.modelShow = true
                            }
                        }
                    }, '忽略')
                ]);
            }
          }
      ],
      data2: [],
      columns3: [
          {
              title: '市场',
              key: 'market'
          },
          {
              title: '5分钟前价格',
              key: 'fiveMinutesAgo'
          },
          {
              title: '当前价格',
              key: 'now'
          },
          {
              title: '价格浮动',
              key: 'floatChange',
              render: (h, params) => { 
                    return h('div', [params.row.floatChange * 100, '%' ])
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
                                // util.setDialog(login_record)
                                // this.title = '编辑管理员'
                                // this.editData = params.row;
                                // this.modelShow = true
                                otcApi.handleMarketAbnormal({
                                    marketAbnormalId: params.row.marketAbnormalId
                                }, (res) => {
                                     this.$Message.success({content: '处理成功'})
                                     this.getPriceFloat()
                                })
                            }
                        }
                    }, '忽略')
                ]);
            }
          }
      ],
      data3: [],
      columns4: [{
              title: '市场',
              key: 'market'
          },
          {
              title: '5分钟前交易量',
              key: 'fiveMinutesAgo'
          },
          {
              title: '当前交易量',
              key: 'now'
          },
          {
              title: '浮动',
              key: 'floatChange',
              render: (h, params) => { 
                    return h('div', [params.row.floatChange * 100, '%' ])
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
                                // util.setDialog(login_record)
                                // this.title = '编辑管理员'
                                // this.editData = params.row;
                                // this.modelShow = true
                                 otcApi.handleMarketAbnormal({
                                    marketAbnormalId: params.row.marketAbnormalId
                                }, (res) => {
                                     this.$Message.success({content: '处理成功'})
                                     this.getAmountFloat()
                                })
                            }
                        }
                    }, '忽略')
                ]);
            }
          }
      ],
      data4: [],
      columns5: [{
              title: '用户',
              key: 'market'
          },
          {
              title: '登录次数',
              key: 'fiveMinutesAgo'
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
                            }
                        }
                    }, '忽略')
                ]);
            }
          }
      ],
      data5: [],
      columns6: [{
              title: 'API',
              key: 'market'
          },
          {
              title: '访问次数',
              key: 'fiveMinutesAgo'
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
                            }
                        }
                    }, '忽略')
                ]);
            }
          }
      ],
      data6: [],
    }
  },
  created () {
      this.getMonitoring()
      this.getAbnormalInfo()
      this.getPriceFloat()
      this.getAmountFloat()
      this.getabnormal()
  },
  methods: {
      getabnormal () {
          otcApi.abnormalAmountInfo((res) => {
              this.datas = res
          })
      },
      getMonitoring () {
          otcApi.getMonitoring(this.curPage, {
              displayAll: false
          }, (res, total) => {
              this.total = total
              this.data1 = res
          })
      },
      changePage (page) {
        this.curPage = page
        this.getMonitoring()
      },
      getAbnormalInfo () {
          otcApi.getAbnormalInfo(this.curPage1, {
              displayAll: false
          }, (res, total) => {
              this.total1 = total
              this.data2 = res
          })
      },
      changePage1 (page) {
        this.curPage1 = page
        this.getAbnormalInfo()
      },
      getPriceFloat () {
          otcApi.getPriceFloat(this.curPage2,{
              displayAll: false
          }, (res, total) => {
              this.total2 = total
              this.data3 = res
          })
      },
      changePage2 (page) {
        this.curPage2 = page
        this.getPriceFloat()
      },
      getAmountFloat () {
          otcApi.getTransactionAmountFloat(this.curPage3, {
              displayAll: false
          },(res, total) => {
              this.total3 = total
              this.data4 = res
          })
      },
      changePage3 (page) {
        this.curPage3 = page
        this.getAmountFloat()
      }
  }
}
</script>

<style lang="less">
</style>
