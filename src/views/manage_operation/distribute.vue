<!-- 分发 -->
<template>
    <Card>
      <p slot="title">分发</p>
      <Row>
          <Col span="12">
            状态：
            <Select v-model="stauts" style="width:200px">
                <Option value="0">未分发</Option>
                <Option value="1">已分发</Option>
                <Option value="2">已取消</Option>
            </Select>
             <Button type="primary" style="float:right" @click="curPage=1;getDistribute()">查询</Button>
          </Col>
           <Col span="12">
                <Button type="primary" style="float:right" @click="creates()">创建分发</Button>
           </Col>
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
            stauts: 0,
            curPage: 1, 
            total: 0,
            columns1: [
                {
                    title: '币种',
                    key: 'symbol'
                },
                {
                    title: '对象',
                    key: 'username'
                },
                {
                    title: '时间',
                    key: 'createdTime'
                },
                {
                    title: '总量',
                    key: 'quantity'
                },
                {
                    title: '状态',
                    key: 'distributeState',
                    render: (h, params) => {
                        return h('div', this.swithStatus(params.row.distributeState))
                    }
                },
                {
                    title: '备注',
                    key: 'remarks'
                },
                {
                    title: '分发操作',
                    key: 'opreat',
                    render: (h, params) => {
                      return h('div', [
                          h('Button', { //分发状态(0：未分发 1：已分发 2：已取消)
                              props: {type: 'primary', size: 'small', disabled: params.row.distributeState === 1 || params.row.distributeState === 2},
                              style: {marginRight: '10px'},
                              on: {
                                  click: () => {
                                     extendApi.distribute(params.row.distributeId, (res) => {
                                         this.$Message.success({content: '分发成功'})
                                         this.getDistribute()
                                     }, (msg) => {
                                         this.$Message.error({content: msg})
                                     })
                                  }
                              }
                          }, '分发'),
                          h('Button', {
                              props: {type: 'primary', size: 'small', disabled: params.row.distributeState === 1 || params.row.distributeState === 2},
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
      swithStatus (stauts) {
          switch (stauts) {
              case 0:
                return '未分发'
                break;
              case 1:
                return '已分发'
                break;
              case 2:
                return '已取消'
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
