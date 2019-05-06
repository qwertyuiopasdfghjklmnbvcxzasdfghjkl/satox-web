<!-- 紧急异常预警 -->
<template>
  <div>
    <Card>
        <p slot="title">{{$t('risk.jjycyj')}}
            <span class="refresh" @click="getfindReconciliation"></span>
        </p>
        <Row>
          <Col span="8">{{$t('risk.dcljjycs')}}：0</Col>
          <Col span="8">{{$t('risk.dcljjyjgs')}}：0</Col>
          <Col span="8">{{$t('risk.rxzyjs')}}：0</Col>
        </Row>
    </Card>
    <Card style="margin-top:10px;">
        <p slot="title">{{$t('risk.dzyc')}}</p>
        <Table :columns="columns1" :data="data1"></Table>
        <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
    </Card>
    <Card style="margin-top:10px;">
        <p slot="title">{{$t('risk.wlyd')}}</p>
        <Table :columns="columns2" :data="data2"></Table>
    </Card>
  </div>
</template>

<script>
import otcApi from '../../api/otcAberrant'
    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                columns1: [
                    {
                        title: this.$t('risk.dzzt'), // 0: 异常
                        key: 'status'
                    },
                    {
                        title: this.$t('common.yhm'),
                        key: 'username'
                    },
                    {
                        title: this.$t('common.zh'),
                        key: 'accountName'
                    },
                    {
                        title: this.$t('risk.ycyy'),
                        key: 'abnormalReason'
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
                                  props: {type: 'primary', size: 'small',disabled: params.row.status === 1},
                                  style: {marginRight: '10px'},
                                  on: {
                                      click: () => {
                                        otcApi.handleReconciliationAbnormal({
                                            emergencyAbnormalId: params.row.emergencyAbnormalId
                                        }, (res) => {
                                            this.$Message.success({content: this.$t('risk.hncg')})
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
                data1: [],
                columns2: [
                    {
                        title: this.$t('common.sj'),
                        key: 'time'
                    },
                    {
                        title: this.$t('risk.yc'),
                        key: 'overtime'
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
                data2: []
            }
        },
        created () {
            this.getfindReconciliation()
        },
        methods: {
            getfindReconciliation () {
                otcApi.findReconciliation(this.curPage, {
                    displayAll: false
                }, (res) => {
                    this.data1 = res
                })
            },
            changePage (page) {
                this.curPage = page
                this.getfindReconciliation()
            }
        }
    }
</script>
<style lang="less" scoped>
.refresh{width: 49px;height: 24px;background: url(../../images/frsh.png) center/cover no-repeat;background-size: contain;cursor: pointer;color: #2d8cf0;}
.ivu-card-head-inner, .ivu-card-head p{display: flex !important;justify-content: space-between  !important;height: 40px !important; line-height: 40px !important;}
</style>
