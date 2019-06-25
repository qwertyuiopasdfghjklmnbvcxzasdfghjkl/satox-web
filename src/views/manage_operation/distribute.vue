<!-- 分发 -->
<template>
    <Card>
      <p slot="title">{{$t('operation.ff')}}</p>
      <Row>
          <Col span="12">
            {{$t('common.zt')}}：
            <Select v-model="stauts" style="width:200px">
                <Option value="0">{{$t('operation.wff')}}</Option>
                <Option value="1">{{$t('operation.yff')}}</Option>
                <Option value="2">{{$t('operation.yqx')}}</Option>
            </Select>
             <Button type="primary" style="float:right" @click="curPage=1;getDistribute()">{{$t('common.cx')}}</Button>
          </Col>
           <Col span="12">
                <Button type="primary" style="float:right" @click="creates()">{{$t('operation.cjff')}}</Button>
           </Col>
      </Row>
      <Table :columns="columns1" :data="data1" style="margin-top:20px;"></Table>
      <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
    </Card>
</template>

<script>
import util from '../../libs/util'
import create from './distrbute/create'
import extendApi from '../../api/extend'
export default {
    data () {
        return {
            stauts: 0,
            curPage: 1,
            total: 0,
            columns1: [
                {
                    title: this.$t('common.bz'),
                    key: 'symbol'
                },
                {
                    title: this.$t('operation.dx'),
                    key: 'username'
                },
                {
                    title: this.$t('common.sj'),
                    key: 'createdTime'
                },
                {
                    title: this.$t('exchange.zl'),
                    key: 'quantity'
                },
                {
                    title: this.$t('common.zt'),
                    key: 'distributeState',
                    render: (h, params) => {
                        return h('div', this.swithStatus(params.row.distributeState))
                    }
                },
                {
                    title: this.$t('common.bz'),
                    key: 'remarks'
                },
                {
                    title: this.$t('operation.ffcz'),
                    key: 'opreat',
                    render: (h, params) => {
                      return h('div', [
                          h('Button', { //分发状态(0：未分发 1：已分发 2：已取消)
                              props: {type: 'primary', size: 'small', disabled: params.row.distributeState === 1 || params.row.distributeState === 2},
                              style: {marginRight: '10px'},
                              on: {
                                  click: () => {
                                     extendApi.distribute(params.row.distributeId, (res) => {
                                         this.$Message.success({content: this.$t('operation.ffcg')})
                                         this.getDistribute()
                                     }, (msg) => {
                                         this.$Message.error({content: msg})
                                     })
                                  }
                              }
                          }, this.$t('operation.ff')),
                          h('Button', {
                              props: {type: 'primary', size: 'small', disabled: params.row.distributeState === 1 || params.row.distributeState === 2},
                              style: {marginRight: '10px'},
                              on: {
                                  click: () => {
                                    extendApi.cancelDistribute(params.row.distributeId, (res) => {
                                        this.$Message.success({content:  this.$t('operation.qxcg')})
                                        this.getDistribute()
                                    })
                                  }
                              }
                          }, this.$t('common.qx'))
                      ]);
                  }
                }
            ],
            data1: []
        }
    },
    created () {
        this.getDistribute()
    },
    methods: {
      swithStatus (stauts) {
          switch (stauts) {
              case 0:
                return this.$t('operation.wff')
                break;
              case 1:
                return this.$t('operation.yff')
                break;
              case 2:
                return this.$t('operation.yqx')
                break;
          }
      },
      getDistribute () {
          extendApi.findAllDistribute(this.curPage,{
              distributeState: 0 || Number(this.stauts)
          }, (res, total) => {
              this.total = total
              this.data1 = res
          })
      },
      changePage (page) {
        this.curPage = page
        this.getDistribute()
      },
      creates () {
        util.setDialog(create, {
            okCallback: () => {
                this.getDistribute()
            }
        })
      }
    }
}
</script>
