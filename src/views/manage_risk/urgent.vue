<!-- 紧急异常预警 -->
<template>
  <div>
    <Card>
        <p slot="title">紧急异常预警</p>
        <Row>
          <Col span="8">待处理紧急异常数：0</Col>
          <Col span="8">待处理紧急预警告数：0</Col>
          <Col span="8">日新增预警数：0</Col>
        </Row>
    </Card>
    <Card style="margin-top:10px;">
        <p slot="title">对账异常</p>
        <Table :columns="columns1" :data="data1"></Table>
        <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
    </Card>
    <Card style="margin-top:10px;">
        <p slot="title">网络拥堵</p>
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
                        title: '对账状态', // 0: 异常 
                        key: 'status'
                    },
                    {
                        title: '用户名',
                        key: 'username'
                    },
                    {
                        title: '账号',
                        key: 'accountName'
                    },
                    {
                        title: '异常原因',
                        key: 'abnormalReason'
                    },
                    {
                        title: '操作',
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
                                            this.$Message.success({content: '忽略成功'})
                                        }, (msg) => {
                                            this.$Message.error({content: msg})
                                        })
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
                        title: '时间',
                        key: 'time'
                    },
                    {
                        title: '延长',
                        key: 'overtime'
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
                data2: [
                    {
                        time: '2018.04.24 12:00',
                        overtime: '222MS'
                    },
                    {
                        time: '2018.04.24 12:00',
                        overtime: '222MS'
                    }
                ]
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
