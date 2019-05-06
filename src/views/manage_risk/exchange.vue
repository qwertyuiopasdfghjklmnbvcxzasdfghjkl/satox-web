<!-- 币币异常预警 -->
<template>
  <div>
    <Card>
      <p slot="title">{{$t('risk.bbycyj')}}
          <span class="refresh" @click="reshAll"></span>
      </p>
      <Row>
          <Col span="12">{{$t('risk.dclycyjs')}}：{{this.datas.waitHandleAmount}}</Col>
          <Col span="12">{{$t('risk.rxzyjs')}}：{{this.datas.dailyIncreaseAmount}}</Col>
      </Row>
      <Card style="margin-top:16px;">
        <p slot="title">{{$t('risk.detb')}}</p>
        <Table :columns="columns1" :data="data1"></Table>
        <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
      </Card>
      <Card style="margin-top:16px;">
        <p slot="title">{{$t('risk.decz')}}</p>
        <Table :columns="columns2" :data="data2"></Table>
        <Page :current="curPage1" :total="total1" @on-change="changePage1" style="text-align:center;margin-top:20px;"></Page>
      </Card>
      <Card style="margin-top:16px;">
        <p slot="title">{{$t('risk.jgycbd')}}</p>
        <Table :columns="columns3" :data="data3"></Table>
        <Page :current="curPage2" :total="total2" @on-change="changePage2" style="text-align:center;margin-top:20px;"></Page>
      </Card>
      <Card style="margin-top:16px;">
        <p slot="title">{{$t('risk.jylycbd')}}</p>
        <Table :columns="columns4" :data="data4"></Table>
        <Page :current="curPage3" :total="total3" @on-change="changePage3" style="text-align:center;margin-top:20px;"></Page>
      </Card>
      <Card style="margin-top:16px;">
        <p slot="title">{{$t('risk.yhycdl')}}</p>
        <Table :columns="columns5" :data="data5"></Table>
        <Page :current="curPage5" :total="total5" @on-change="changePage5" style="text-align:center;margin-top:20px;"></Page>
      </Card>
      <Card style="margin-top:16px;">
        <p slot="title">{{$t('risk.gpapifw')}}</p>
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
      curPage5: 1,
      total5: 0,
      columns1: [
          {
              title: this.$t('common.yhm'),
              key: 'userName'
          },
          {
              title: this.$t('common.bz'),
              key: 'symbol'
          },
          {
              title: this.$t('risk.tbs'),
              key: 'withdrawAmount'
          },
          {
              title: this.$t('risk.ycsj'),
              key: 'createdTime'
          },
          {
              title: this.$t('common.cz'),
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
                                    this.$Message.success({content: this.$t('risk.clcg')})
                                    this.getMonitoring()
                                })
                                // util.setDialog(login_record)
                                // this.title = '编辑管理员'
                                // this.editData = params.row;
                                // this.modelShow = true
                            }
                        }
                    }, this.$t('risk.hn'))
                ]);
            }
          }
      ],
      data1: [],
      columns2: [
          {
              title: this.$t('common.yhm'),
              key: 'userName'
          },
          {
              title: this.$t('common.bz'),
              key: 'symbol'
          },
          {
              title: this.$t('risk.czs'),
              key: 'rechargeAmount'
          },
          {
              title: this.$t('risk.ycsj'),
              key: 'createdTime'
          },
          {
              title: this.$t('common.cz'),
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
                                    this.$Message.success({content: this.$t('risk.clcg')})
                                    this.getAbnormalInfo()
                                })
                                // util.setDialog(login_record)
                                // this.title = '编辑管理员'
                                // this.editData = params.row;
                                // this.modelShow = true
                            }
                        }
                    }, this.$t('risk.hn'))
                ]);
            }
          }
      ],
      data2: [],
      columns3: [
          {
              title: this.$t('risk.sc'),
              key: 'market'
          },
          {
              title: this.$t('risk.wfzqjg'),
              key: 'fiveMinutesAgo'
          },
          {
              title: this.$t('risk.dqjg'),
              key: 'now'
          },
          {
              title: this.$t('risk.jgfd'),
              key: 'floatChange',
              render: (h, params) => {
                    return h('div', [params.row.floatChange * 100, '%' ])
              }
          },
          {
              title: this.$t('risk.ycsj'),
              key: 'transactionTime'
          },
          {
              title: this.$t('common.cz'),
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
                                     this.$Message.success({content: this.$t('risk.clcg')})
                                     this.getPriceFloat()
                                })
                            }
                        }
                    }, this.$t('risk.hn'))
                ]);
            }
          }
      ],
      data3: [],
      columns4: [{
              title: this.$t('risk.sc'),
              key: 'market'
          },
          {
              title: this.$t('risk.wfzqjyl'),
              key: 'fiveMinutesAgo'
          },
          {
              title: this.$t('risk.dqjyl'),
              key: 'now'
          },
          {
              title: this.$t('risk.fd'),
              key: 'floatChange',
              render: (h, params) => {
                    return h('div', [params.row.floatChange * 100, '%' ])
              }
          },
          {
              title: this.$t('risk.ycsj'),
              key: 'transactionTime'
          },
          {
              title: this.$t('common.cz'),
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
                                     this.$Message.success({content: this.$t('risk.clcg')})
                                     this.getAmountFloat()
                                })
                            }
                        }
                    }, this.$t('risk.hn'))
                ]);
            }
          }
      ],
      data4: [],
      columns5: [{
              title: this.$t('common.yhm'),
              key: 'username'
          },
           {
              title: this.$t('risk.yclx'),
              key: 'type',
              render: (h, params) => {
                  return h('div', params.row.type === 1 ? this.$t('risk.dlplgg') : this.$t('risk.yddl'))
              }
          },
          {
              title: this.$t('risk.dlcsdlddgs'),
              key: 'loginCount',
              render: (h, params) => {
                  return h('div', [params.row.type === 1 ? params.row.loginCount : params.row.loginAddressAmount])
              }
          },
          {
              title: this.$t('risk.dlsjdldd'),
              key: 'loginCount',
              render: (h, params) => {
                  return h('div', [params.row.type === 1 ? params.row.loginTimes : params.row.loginAddresses])
              }
          },
          {
              title: this.$t('risk.ycsj'),
              key: 'createTime'
          },
          {
              title: this.$t('common.cz'),
              key: 'opreat',
              render: (h, params) => {
                return h('div', [
                    h('Button', {
                        props: {type: 'primary', size: 'small'},
                        style: {marginRight: '10px'},
                        on: {
                            click: () => {
                                otcApi.handleUserLoginAbnormal({
                                    abnormalLoginId: params.row.abnormalLoginId
                                }, (res) => {
                                    this.$Message.success({content: this.$t('risk.clcg')})
                                    this.getLoginUserInfo()
                                }, (msg) => {
                                    this.$Message.error({content: msg})
                                })
                            }
                        }
                    }, this.$t('risk.hn'))
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
              title: this.$t('risk.fwcs'),
              key: 'fiveMinutesAgo'
          },
          {
              title: this.$t('risk.ycsj'),
              key: 'createdTime'
          },
          {
              title: this.$t('common.cz'),
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
                    }, this.$t('risk.hn'))
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
      this.getLoginUserInfo()
  },
  methods: {
      reshAll () {
        this.getMonitoring()
        this.getAbnormalInfo()
        this.getPriceFloat()
        this.getAmountFloat()
        this.getabnormal()
        this.getLoginUserInfo()
      },
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
      },
      getLoginUserInfo () {
          otcApi.findAbnormalLoginUserInfo(this.curPage, {
              displayAll: false
          }, (res, total) => {
              this.total5 = total
              this.data5 = res
          })
      },
      changePage5 (page) {
        this.curPage5 = page
        this.getAmountFloat()
      },
  }
}
</script>

<style lang="less" scoped>
.refresh{width: 49px;height: 24px;background: url(../../images/frsh.png) center/cover no-repeat;background-size: contain;cursor: pointer;color: #2d8cf0;}
.ivu-card-head-inner, .ivu-card-head p{display: flex !important;justify-content: space-between  !important;height: 40px !important; line-height: 40px !important;}
</style>
