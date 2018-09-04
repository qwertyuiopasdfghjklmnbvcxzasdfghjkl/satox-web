<!-- 分发 -->
<template>
    <Card>
      <p slot="title">分发</p>
      <Row>
          <Button type="primary" style="float:right" @click="creates()">创建分发</Button>
      </Row>
      <Table :columns="columns1" :data="data1" style="margin-top:20px;"></Table>
      <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
    </Card>
</template>

<script>
import util from '../../libs/util'
import create from './create'
import extendApi from '../../api/extend'
export default {
    data () {
        return {
            curPage: 1, 
            total: 0,
            columns1: [
                {
                    title: '币种',
                    key: 'symbol'
                },
                {
                    title: '对象',
                    key: 'userId'
                },
                // {
                //     title: '规则',
                //     key: '121212121',
                    // render: (h, params) => {
                    //     return h('div', params.row.distributeType === 0 ? '单条分发': '多条分发')
                    // }
                // },
                {
                    title: '时间',
                    key: 'createdTime'
                },
                {
                    title: '总量',
                    key: 'quantity'
                },
                {
                    title: '分发操作',
                    key: 'opreat',
                    render: (h, params) => {
                      return h('div', [
                          h('Button', { //分发状态(0：未分发 1：已分发 2：已取消)
                              props: {type: 'primary', size: 'small'},
                              style: {marginRight: '10px'},
                              on: {
                                  click: () => {
                                     extendApi.distribute(params.row.distributeId, (res) => {
                                         this.$Message.success({content: '分发成功'})
                                         this.getDistribute()
                                     }, (msg) => {
                                         this.$Message.erroe({content: msg})
                                     })
                                  }
                              }
                          }, '分发'),
                          h('Button', {
                              props: {type: 'primary', size: 'small'},
                              style: {marginRight: '10px'},
                              on: {
                                  click: () => {
                                    extendApi.cancelDistribute(params.row.distributeId, (res) => {
                                        this.$Message.success({content: '取消成功'})
                                        this.getDistribute()
                                    })
                                  }
                              }
                          }, '取消')
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
      getDistribute () {
          extendApi.findAllDistribute(this.curPage, (res, total) => {
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
