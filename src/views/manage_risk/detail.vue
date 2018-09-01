<template>
    <div class="detail" style="width: 850px;">
        <Card>
            <p slot="title">详情
                <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
            </p>
            <Table :columns="columns1" :data="data1"></Table>
        </Card>
    </div>
</template>
<script>
import otcApi from '../../api/otcAberrant'
import util from '../../libs/util';
    export default {
        props: ['orderId'],
        data () {
            return {
                columns1: [
                    {
                        title: '订单号',
                        key: 'orderNumber'
                    },
                    {
                        title: '订单状态',//state
                        key: 'state',
                        render: (h, params) => { 
                            return h('div', this.switchStaus(params.row.state, params.row.payState))
                        }
                    },
                    {
                        title: '数量',
                        key: 'currencyCount'
                    },
                    {
                        title: '金额',
                        key: 'curPrice',
                        width: 200,
                        render: (h, params) => { 
                                return h('div', [params.row.curPrice, params.row.currency])
                        }
                    },
                    {
                        title: '付款剩余时间',
                        key: 'surplus_Time',
                        width: 150,
                        render: (h, params) => {
                            return h('div', [params.row.state == 2 ? '00:00' : params.row.surplus_Time]);
                        }
                    },
                    {
                        title: '完成时间',
                        key: 'updatedAt'
                    }
                ],
                data1: []
            }
        },
        created () {
            this.getOrderInfo()
        },
        methods: {
            switchStaus(state, payState) { 
                switch(state){
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
            getOrderInfo () {
                otcApi.findOtcOrderInfo({
                    orderId: this.orderId
                }, (res) => {
                    // res.forEach((item, index) => {
                        // item.createTime = item.createdAt
                        let date = util.formatDate(res.createdAt).getTime()
                        let ndate = util.formatDate(res.currentDate).getTime()
                        var diffTime = Math.floor((ndate - date) / 1000)
                        var surplusTime = res.payApplyTime * 60 - diffTime
                        if (res.payState == 0 && res.state == 1) {
                            util.countDown(surplusTime, (time) => {
                                res.surplus_Time = time
                            })            
                        }
                        res.surplus_Time = '00:00'
                    // })
                    this.data1 = [res]
                })
            },
            closeDialog () {
                this.$emit('removeDialog')
            }
        }
    }
</script>