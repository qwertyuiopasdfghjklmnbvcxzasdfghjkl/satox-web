<template>
  <Card style="width:1000px;">
        <p slot="title">
            查看订单
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Table :columns="columns1" :data="data1"></Table>
  </Card>
</template>

<script>
import util from '../../../libs/util';
import chatModel from '../orders/chatModel';
import otcApi from '../../../api/otc'
export default {
    props: ['msgNumber'],
    data () {
        return {
            columns1: [
                {title: '订单号', key: 'orderNumber'},
                {title: '卖家账号', key: 'fromUserName'},
                {title: '买家账号', key: 'toUserName'},
                {title: '交易量', key: 'symbolCount',
                    render: (h, params) => {
                        return h('div', [params.row.symbolCount, params.row.symbol]);
                    }
                },
                {title: '支付金额', key: 'currencyCount',
                    render: (h, params) => {
                        return h('div', [params.row.currencyCount, 'CNY']);
                    }
                },
                {title: '交易状态', key: 'state',
                    // （1：交易中、2：已完成、3：已取消） 
                     render: (h, params) => { 
                        return h('div', this.switchStaus(params.row.state, params.row.payState))
                    }
                },
                {title: '交易限时', key: 'surplus_Time', render: (h, params) => {
                    return h('div', [params.row.surplus_Time] )
                }},
                {title: '操作', key: 'action', render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {type: 'primary', size: 'small'},
                            on: {
                                click: () => {
                                    util.setDialog(chatModel, {
                                        orderNumber: params.row.orderNumber,
                                        type: 'chat'
                                    });
                                }
                            }
                        }, '聊天记录')
                    ])
                }}
            ],
            data1: []
        }
    },
    created () {
        this.getOrderInfo()
    },
    methods: {
        switchStaus(state, payState) { 
            switch(state, payState){
                case 1:
                    return payState === 1 ? '已付款' : '未付款'
                    break;
                case 2:
                    return '已完成'
                    break;
                case 3:
                    return '已取消'
                    break;
            }
        },
        aaa (curPrice, symbolCount) {
            return (curPrice * symbolCount)
        },
        closeDialog () {
            this.$emit('removeDialog');
        },
        getOrderInfo () {
            otcApi.selectOneOrderInfo({
                msgNumber: this.msgNumber
            }, (res) => {
                res.createTime = res.createdAt
                let date = util.formatDate(res.createTime).getTime()
                let ndate = util.formatDate(res.nowTime).getTime()
                var diffTime = Math.floor((ndate - date) / 1000)
                var surplusTime = res.payApplyTime * 60 - diffTime
                util.countDown(surplusTime, (time) => {
                    res.surplus_Time = time
                })
                res.surplus_Time = '00:00'
                this.data1 = [res]
            })
        }
    }
}
</script>

<style>

</style>
