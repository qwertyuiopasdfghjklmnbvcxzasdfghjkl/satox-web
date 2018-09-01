<template>
    <Card style="width:1200px;">
        <p slot="title">
            <span style="margin-right:20px;">交易信息</span>
            <span style="font-weight:normal;">该用户已完成 {{this.exchangeTotal !== null ? this.exchangeTotal : 0}} 笔交易，好评率：{{this.praiseRate !== null ? this.praiseRate : 100}}%</span>
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
            
        </p>
        <Tabs>
            <TabPane label="订单信息">
                <Table :columns="columns1" :data="datas1"></Table>
                <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
            </TabPane>
            <TabPane label="广告信息">
                <Table :columns="columns2" :data="datas2"></Table>
                <Page :current="curPage2" :total="total2" @on-change="changePage2" style="text-align:center;margin-top:20px;"></Page>
            </TabPane>
        </Tabs>
    </Card>
</template>

<script>
import util from '../../../libs/util';
import qs from 'qs';
import otcApi from '../../../api/otc'
export default {
    props: ['userId'],
    data () {
        return {
            curPage: 1,
            total: 0,
            curPage2: 1,
            total2: 0,
            columns1: [
                {title: '订单号', key: 'orderNum'},
                {title: '类型', key: 'exchangeType', render: (h, params) => {
                    return h('div', [params.row.exchangeType === 1 ? '购买' : '出售']);
                }},
                {title: '状态', key: 'state',
                    render: (h, params) => {
                        return h('div', this.switchStaus(params.row.state, params.row.payState));
                    }
                },
                {title: '币种', key: 'symbol'},
                {title: '单价', key: 'unitPrice',
                    render: (h, params) => {
                        return h('div', [params.row.unitPrice, params.row.currency])
                    }
                },
                {title: '数量', key: 'symbolCount',
                    render: (h, params) => {
                        return h('div', [params.row.symbolCount, params.row.symbol])
                    }
                },
                
                {title: '金额', key: 'currencyCount',
                    render: (h, params) => {
                        return h('div', [params.row.currencyCount, params.row.currency])
                    }
                },
                {title: '下单时间', key: 'createdTime'}
            ],
            datas1: [],
            columns2: [
                {title: '发布者', key: 'username'},
                {title: '类型', key: 'adType', render: (h, params) => { //1：购买、2：出售
                    return h('div', [params.row.adType === '1' ? '购买' : '出售']);
                }},
                {title: '币种', key: 'symbol', render: (h, params) => {
                    var row = params.row;
                    return h('div', [row.symbol === 1 ? row.currency : row.symbol]);
                }},
                {title: '总数量', key: 'symbolCount',
                    render: (h, params) => {
                        return h('div', [params.row.symbolCount, params.row.symbol])
                    }
                },
                {title: '余额', key: 'remainCount',
                    render: (h, params) => {
                        return h('div', [params.row.remainCount, params.row.symbol])
                    }
                },
                {title: '溢价', key: 'priceRate',
                    render: (h, params) => {
                        return h('div', [params.row.priceRate, '%'])
                    }
                },
                {title: '最高(低)接受价', key: 'acceptPrice',
                    render: (h, params) => {
                        return h('div', [params.row.acceptPrice, params.row.currency])
                    }
                },
                {title: '限额', key: 'minAmount', render: (h, params) => {
                    return h('div', [params.row.minAmount, params.row.currency, ' - ', params.row.maxAmount, params.row.currency]);
                }},
                {title: '发布时间', key: 'createdAt'}
            ],
            datas2: [],
            exchangeTotal: null,
            praiseRate: null
        };
    },
    created () {
        this.getfindAdInfo()
        this.getfindOrderInfo()
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
        getfindAdInfo () {
            otcApi.findAdInfoManage(this.curPage2, {
                userId: this.userId
            }, (res, total) => {
                if (res.length !== 0) {
                   this.total2 = total
                   this.datas2 = res[0].adInfoDTOS
                }
            })
        },
        changePage2 (page) {
            this.curPage2 = page
            this.getfindAdInfo()
        },
        getfindOrderInfo () {
            otcApi.findOrderInfoManage(this.curPage, {
                userId: this.userId
            }, (res, total) => {
                 if (res.length !== 0) {
                    this.praiseRate = res[0].praiseRate
                    this.exchangeTotal = res[0].exchangeTotal 
                    this.total = total
                    this.datas1 = res[0].orderInfoDTOS
                 }
            })
        },
        changePage (page) {
            this.curPage = page
            this.getfindOrderInfo()
        },
        closeDialog () {
          this.$emit('removeDialog');
        }
    }
};
</script>

<style lang="less" scoped>

</style>