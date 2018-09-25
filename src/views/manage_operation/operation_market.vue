<template>
  <div class="operation">
      <Card>
          <p slot="title">特殊市场 
              <Button type="primary" @click="addMarket">新增</Button>
          </p>
          <Table :columns="columns1" :data="data1"></Table> 
          <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
      </Card>
  </div>  
</template>
<script>
import extendApi from '../../api/extend'
import util from '../../libs/util'
import updataMarket from './updataMarket'
import addMarket from './addMarket'
export default {
    data () {
        return{
            curPage: 1,
            total: 0,
            columns1: [
                {
                    title: '编号',
                    key: 'marketId'
                },
                {
                    title: '位置',
                    key: 'idx'
                },
                {
                    title: '市场名称',
                    key: 'market',
                },
                {
                    title: '备注',
                    key: 'remark'
                },
                {
                    title: '操作',
                    key: 'opreat',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {type: 'primary', size: 'small'},
                                style: {marginRight: '20px'},
                                on: {
                                    click: () => {
                                        util.setDialog(updataMarket, {
                                            item: params.row
                                        })
                                    }
                                }
                            }, '修改'),
                            h('Button', {
                                props: {type: 'primary', size: 'small'},
                                on: {
                                    click: () => {
                                        extendApi.cancelSpecialMarket({
                                            marketId: params.row.marketId,
	                                        version: params.row.version
                                        }, (res) => {
                                            this.$Message.success({content:　'取消成功'})
                                            this.getfindSpecialMarket()
                                        }, (msg) => {
                                            this.$Message.error({content: msg})
                                        })
                                    }
                                }
                            }, '取消推荐')
                        ]);
                    }
                }
            ],
            data1: []
        }
    },
    created () {
        this.getfindSpecialMarket()
    },
    methods: {
        addMarket () {
            util.setDialog(addMarket)
        },
        getfindSpecialMarket () {
            extendApi.findSpecialMarket(this.curPage, {},(res) => {
                this.data1 = res
            })
        },
        changePage () {
            this.curPage = page
        }
    }
}
</script>
