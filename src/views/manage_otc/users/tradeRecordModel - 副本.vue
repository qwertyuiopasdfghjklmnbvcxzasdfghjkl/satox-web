<template>
    <Card style="width:1200px;">
        <p slot="title">
            <span style="margin-right:20px;">交易信息</span>
            <span style="font-weight:normal;">该用户已完成：199笔交易，好评率：100%</span>
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Tabs>
            <TabPane label="订单信息">
                <Table :columns="columns1" :data="datas1"></Table>
            </TabPane>
            <TabPane label="广告信息">
                <Table :columns="columns2" :data="datas2"></Table>
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
            columns1: [
                {title: '订单号', key: 'orderId'},
                {title: '类型', key: 'exchangeType', render: (h, params) => {
                    return h('div', [params.row.trade_type === 1 ? '购买' : '出售']);
                }},//1：交易中、2：已完成、3：已取消
                {title: '状态', key: 'state'},
                {title: '币种', key: 'symbol'},
                {title: '单价', key: 'unitPrice'},
                {title: '数量', key: 'symbolCount'},
                {title: '金额', key: 'currencyCount'},
                {title: '下单时间', key: 'createdTime'}
            ],
            datas1: [],
            columns2: [
                {title: '发布者', key: 'username'},
                {title: '类型', key: 'adType', render: (h, params) => { //1：购买、2：出售
                    return h('div', [params.row.trade_type === 1 ? '购买' : '出售']);
                }},
                {title: '币种', key: 'symbol', render: (h, params) => {
                    var row = params.row;
                    return h('div', [row.trade_type === 1 ? row.currency : row.symbol]);
                }},
                {title: '总数量', key: 'symbolCount'},
                {title: '余额', key: 'remainCount'},
                {title: '溢价', key: 'praiseRate'},
                {title: '最高(低)接受价', key: 'acceptPrice'},
                {title: '限额', key: 'minAmount', render: (h, params) => {
                    return h('div', [params.row.minAmount, ' - ', params.row.maxAmount]);
                }},
                {title: '发布时间', key: 'createdAt'}
            ],
            datas2: []
        };
    },
    created () {
        this.getfindAdInfo()
        this.getfindOrderInfo()
    },
    methods: {
        getfindAdInfo () {
            otcApi.findAdInfoManage({
                userId: this.userId
            }, (res) => {
                this.datas2 = res[0].adInfoDTOS
                // this.xiane = this.datas2.minAmount - this.datas2.maxAmount
            })
        },
        getfindOrderInfo () {
            otcApi.findOrderInfoManage({
                userId: this.userId
            }, (res) => {
                this.datas1 = res[0].orderInfoDTOS
            })
        },
    //   getOrderInfo (userId) {
    //     util.ajax.get(`api/v1/manage/otc/customer/orderInfo/${userId}`, {params: {type: 1}}).then((res) => {
    //       if (res.data && res.data.rst === 1) {
    //         var data = res.data.data;
    //         this.datas = data
    //       } else if (res.data && res.data.rst !== 1) {
    //         var msgs = res.data.msg;
    //         this.$Message.error(typeof msgs === 'string' ? msgs : msgs[0]);
    //       } else {
    //         this.$Message.error('其他错误');
    //         window.console.log(error);
    //       }
    //     })
    //   },
      closeDialog () {
          this.$emit('removeDialog');
      }
    }
};
</script>

<style lang="less" scoped>

</style>