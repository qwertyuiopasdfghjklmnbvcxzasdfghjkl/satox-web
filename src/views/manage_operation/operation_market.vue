<template>
  <div class="operation">
      <Card>
          <p slot="title">{{$t('operation.tssc')}}
              <Button type="primary" @click="addMarket">{{$t('common.xz')}}</Button>
          </p>
          <Table :columns="columns1" :data="data1"></Table>
          <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
      </Card>
  </div>
</template>
<script>
import extendApi from '../../api/extend'
import util from '../../libs/util'
import updataMarket from './market/updataMarket'
import addMarket from './market/addMarket'
export default {
    data () {
        return{
            curPage: 1,
            total: 0,
            columns1: [
                {
                    title: this.$t('operation.bh'),
                    key: 'marketId'
                },
                {
                    title: this.$t('operation.wz'),
                    key: 'idx'
                },
                {
                    title: this.$t('operation.scmc'),
                    key: 'market',
                },
                {
                    title: this.$t('common.bz'),
                    key: 'remark'
                },
                {
                    title:  this.$t('common.cz'),
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
                            },  this.$t('common.xg')),
                            h('Button', {
                                props: {type: 'primary', size: 'small'},
                                on: {
                                    click: () => {
                                        extendApi.cancelSpecialMarket({
                                            marketId: params.row.marketId,
	                                        version: params.row.version
                                        }, (res) => {
                                            this.$Message.success({content:　this.$t('operation.qxcg')})
                                            this.getfindSpecialMarket()
                                        }, (msg) => {
                                            this.$Message.error({content: msg})
                                        })
                                    }
                                }
                            }, this.$t('operation.qxtj'))
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
