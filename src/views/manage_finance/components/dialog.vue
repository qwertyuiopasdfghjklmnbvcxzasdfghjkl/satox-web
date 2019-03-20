<template>
  <Card style="width:800px;height:500px;">
      <p slot="title">
          <span>异常交易</span>
          <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
      </p>
      <Table :columns="columns" :data="datas"></Table>
      <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
  </Card>
</template>

<script>
import financeApi from '../../../api/finance'
export default {
    data () {
        return {
            curPage: 1,
            total: 0,
            columns: [
                {key: 'txId', title: '交易编号'},
                {key: 'market', title: '市场'},
                {key: 'price', title: '价格'},
                {key: 'buyer', title: '买家'},
                {key: 'seller', title: '卖家'},
                {key: 'action', title: '操作', render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {type: 'primary', size: 'small'},
                            on: {
                                click: () => {
                                }
                            }
                        }, '编辑')
                    ]);
                }}
            ],
            datas: []
        }
    },
    created () {
        this.getExchangeList()
    },
    methods: {
        closeDialog () {
            this.$emit('removeDialog')
        },
        getExchangeList () {
            financeApi.findAbnormalExchangeList(this.curPage, (res, total) => {
                this.total = total
                this.datas = res
            })
        },
        changePage (page) {
            this.curPage = page
            this.getExchangeList()
        }
    }
}
</script>

<style>

</style>
