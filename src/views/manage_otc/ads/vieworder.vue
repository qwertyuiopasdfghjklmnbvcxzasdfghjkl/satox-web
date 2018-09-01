<template>
  <Card style="width:1000px;">
        <p slot="title">
           {{this.username}}的订单
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Table :columns="columns1" :data="data1"></Table>
        <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page> 
  </Card>
</template>

<script>
import util from '../../../libs/util'
import otcApi from '../../../api/otc'
export default {
    props: ['adId', 'username', 'symbol'],
    data () {  
        return {
            curPage: 1, 
            total: 0,
            columns1: [
                {title: '订单号', key: 'orderNumber'},
                {title: '订单状态', key: 'state',
                    render: (h, params) => { 
                        return h('div', this.switchStaus(params.row.state))
                    }
                }, //1：交易中、2：已完成、3：已取消
                {title: '订单价格', key: 'curPrice',
                    render: (h, params) => {
                        return h('div', [params.row.curPrice, 'CNY']);
                    }
                },
                {title: '数量', key: 'symbolCount', 
                    render: (h, params) => {
                        return h('div', [params.row.symbolCount, ' ', this.symbol]);
                    }
                },
                {title: '金额', key: 'currencyCount',
                    render: (h, params) => {
                        return h('div', [params.row.currencyCount, 'CNY']);
                    }
                },
                {title: '付款剩余时间', key: 'surplus_Time', render: (h, params) => {
                    return h('div', [params.row.surplus_Time])
                }},
                {title: '完成时间', key: 'updatedTime', render: (h, params) => {
                    return h('div', params.row.state === 1 ? '----' : params.row.updatedTime)
                }}
            ],
            data1: []
        }
    },
    created () {
        this.getfindOrderInfoOtc()
    },
    methods: {
        switchStaus(state) {//1：交易中、2：已完成、3：已取消
            switch(state){
                case 1:
                    return '交易中'
                    break;
                case 2:
                    return '已完成'
                    break;
                case 3:
                    return '已取消'
                    break;
            }
        },
        getfindOrderInfoOtc () {
            otcApi.findOrderInfoOtc(this.curPage, {
                adId: this.adId
            },(res, total) => {
                 res.forEach((item, index) => {
                    item.createTime = item.createdAt
                    let date = util.formatDate(item.createTime).getTime()
                    let ndate = util.formatDate(item.nowTime).getTime()
                    var diffTime = Math.floor((ndate - date) / 1000)
                    var surplusTime = item.payApplyTime * 60 - diffTime
                    util.countDown(surplusTime, (time) => {
                        item.surplus_Time = time
                    })
                    item.surplus_Time = '00:00'
                })
                this.total = total
                this.data1 = res
            }, (msg) => {
                this.$Message.error({content: msg})
            })
        },
        changePage (page) {
            this.curPage = page
            this.getfindOrderInfoOtc()
        },
        closeDialog () {
            this.$emit('removeDialog');
        }
    }
}
</script>

<style>

</style>
