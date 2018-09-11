<template>
    <div class="transferRecord">
        <Card>
            <p slot="title">转账记录</p>
            <Table :columns="columns1" :data="data1"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>  
        </Card>
    </div>
</template>
<script>
import fundApi from '../../api/fund'
export default {
    data () {
        return {
            total: 0,
            curPage: 1,
            columns1: [
                {
                    title: '主键id',
                    key: 'transactionId'
                },
                {
                    title: '交易id',
                    key: 'txId'
                },
                {
                    title: '用户账号',
                    key: 'userName'
                },
                {
                    title: '币种',
                    key: 'symbol'
                },
                {
                    title: '方向',
                    key: 'direction',
                    render: (h, params) => {
                        return h('div', this.statusType(params.row.direction))
                    }
                },
                {
                    title: '交易金额',
                    key: 'amount'
                },
                {
                    title: '区块确认数目',
                    key: 'confirmation'
                },

                {
                    title: '创建时间',
                    key: 'createdTime'
                },
                {
                    title: '完成时间',
                    key: 'completeTime'
                },
                {
                    title: '状态',
                    key: 'status',
                    render: (h, params) => {
                        return h('div', params.row.status === 1 ? '等待' : '完成')
                    }
                },
                {
                    title: '源地址',
                    key: 'fromAddress'
                },
                {
                    title: '目的地址',
                    key: 'toAddress'
                }
            ],
            data1: []
        }
    },
    created () {
        this.getTransactionRecords()
    },
    methods: {
        statusType (state) {
            switch(state){
                case 1:
                    return '充值'
                    break;
                case 2:
                    return '提现'
                    break;
                case 3:
                    return '交易所归集'
                    break;
                case 4:
                    return '冷钱包充值'
                    break;
                case 5:
                    return '冷钱包提现'
                    break;
            }
        },
        getTransactionRecords () {
            fundApi.findTransactionRecords(this.curPage, (res, total) => {
                this.total = total
                this.data1 = res
            })
        },
        changePage (page) {
            this.curPage = page
            this.getTransactionRecords()
        }
    }
}
</script>
<style scoped>
.ivu-card-head p{display: flex;justify-content:space-between;height: 30px;}
</style>