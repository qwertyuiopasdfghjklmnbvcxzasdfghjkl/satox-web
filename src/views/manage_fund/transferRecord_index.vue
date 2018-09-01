<template>
    <div class="transferRecord">
        <Card>
            <p slot="title">转账记录</p>
             <Table :columns="columns1" :data="data1"></Table>
        </Card>
    </div>
</template>
<script>
export default {
    data () {
        return {
            columns1: [
                {
                    title: '创建时间',
                    key: 'time'
                },
                {
                    title: '币种',
                    key: 'symbol'
                },
                {
                    title: '方向',
                    key: 'dection'
                },

                {
                    title: '数量',
                    key: 'number'
                },
                {
                    title: 'TXID',
                    key: 'txid'
                },
                {
                    title: '冷钱包地址',
                    key: 'address'
                },
                {
                    title: '类型',
                    key: 'type'
                }
            ],
            data1: [
                {
                    time: '2016-10-03',
                    symbol: 'BTC',
                    dection: '买',
                    number: 1,
                    txid: 'asfdyhtyiuyiyujgyjhngngjghjh',
                    address: 'sfsdgfdgdfgfdg',
                    type: '自动转账'     
                },
                {
                    time: '2016-10-03',
                    symbol: 'BTC',
                    dection: '买',
                    number: 1,
                    txid: 'asfdyhtyiuyiyujgyjhngngjghjh',
                    address: 'sfsdgfdgdfgfdg',
                    type: '自动转账'     
                }
            ]
        }
    },
    methods: {
    }
}
</script>
<style scoped>
.ivu-card-head p{display: flex;justify-content:space-between;height: 30px;}
</style>