<template>
    <Card class="manage_exchange_msg_record" style="width:700px;">
        <p slot="title">
            {{vm.$t('exchange.xxjl')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Table :columns="columns1" :data="data1"></Table>
         <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
    </Card>
</template>
<script>
import util from '../../../libs/util'
import currenyApi from '../../../api/currency'
export default {
    props: ['userId'],
    data () {
        const vm = window.vm;
        return {
            vm: vm,
            curPage: 1,
            total: 0,
            columns1: [
                {
                    title: vm.$t('common.sj'),
                    key: 'createdTime'
                },
                {
                    title: vm.$t('common.nr'),
                    key: 'msg'
                },
                {
                    title: vm.$t('common.zt'),
                    key: 'messageState', //1已读   2未读
                    render: (h, params) => {
                        return h('div', params.row.messageState == 1 ? vm.$t('exchange.yd') : vm.$t('exchange.wd'))
                    }
                }
            ],
            data1: []
        }
    },
    created() {
        this.msg_record()
    },
    methods: {
        closeDialog () {
            this.$emit('removeDialog')
        },
        msg_record() {
          currenyApi.findUserMessageList(this.curPage, this.userId, (res, total) => {
            res.forEach((item) => {
                //  if (item.isSystem) {
                    item.msg = util.formatSystemMessage(item.msg, item.msgType !== 5 )
                //  }
            })
            this.total = total
            this.data1 = res
          })
        },
        changePage (page) {
            this.curPage = page
            this.msg_record()
        }
    }
}
</script>

<style lang="less">
.manage_exchange_msg_record{
    .cion{text-align: right;font-size: 14px;cursor: pointer;margin-right: 10px;margin-top: 5px;}
    .title{font-size: 14px;font-weight: bold;margin-left: 8px;}
}
</style>
