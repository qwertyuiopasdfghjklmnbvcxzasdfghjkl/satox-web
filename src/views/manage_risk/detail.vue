<template>
    <div class="detail" style="width: 850px;">
        <Card>
            <p slot="title">{{vm.$t('risk.xq')}}
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
            const vm = window.vm;
            return {
                vm: vm,
                columns1: [
                    {
                        title: vm.$t('risk.ddh'),
                        key: 'orderNumber'
                    },
                    {
                        title: vm.$t('risk.ddzt'),//state
                        key: 'state',
                        render: (h, params) => {
                            return h('div', this.switchStaus(params.row.state, params.row.payState))
                        }
                    },
                    {
                        title: vm.$t('common.sl'),
                        key: 'currencyCount'
                    },
                    {
                        title: vm.$t('common.je'),
                        key: 'curPrice',
                        width: 200,
                        render: (h, params) => {
                                return h('div', [params.row.curPrice, params.row.currency])
                        }
                    },
                    {
                        title: vm.$t('risk.fksysj'),
                        key: 'surplus_Time',
                        width: 150,
                        render: (h, params) => {
                            return h('div', [params.row.state == 2 ? '00:00' : params.row.surplus_Time]);
                        }
                    },
                    {
                        title: vm.$t('risk.wcsj'),
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
