<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
         <Table :columns="columns12" :data="data12"></Table>
    </div>
</template>
<script>
import moniApi from '../../api/monitoring'
export default {
    props: {
        row: Object
    },
    data () {
        return {
            columns12: [
                {
                    title: '交易ID',
                    key: 'txId'
                },
                {
                    title: '用户名',
                    key: 'userName'
                },
                {
                    title: '账号ID',
                    key: 'userId'
                },
                {
                    title: '币种',
                    key: 'symbol'
                },
                {
                    title: '公链类型', 
                    key: 'symbolType',
                    render: (h, params) => {
                        return h('div', this.switchStaus(params.row.symbolType))
                    }
                },
                {
                    title: 'from地址',
                    key: 'fromAddress'
                },
                {
                    title: 'to地址',
                    key: 'toAddress'
                },
                {
                    title: '提现数额',
                    key: 'amount'
                },
                {
                    title: '手续费',
                    key: 'procedureFee'
                },
                {
                    title: '矿工费',
                    key: 'minerFee'
                },
                {
                    title: '区块确认数',
                    key: 'confirmation'
                },
                {
                    title: '区块号',
                    key: 'blockNumber'
                },
                {
                    title: '状态',  //1等待 2 完成
                    key: 'status',
                    render: (h, params) => {
                        return h('div', params.row.status === 1 ? '等待': '完成')
                    }
                },
                {
                    title: '是否已记账',//1未记账 1已记账
                    key: 'ledgeredFlag',
                    render: (h, params) => {
                        return h('div', params.row.ledgeredFlag === 1 ? '未记账': '已记账')
                    }
                },
                {
                    title: '创建时间',
                    key: 'createdTime'
                },
            ],
            data12: []
        }
    },
    created () {
        this.gettransactionConfirmList()
    },
    methods: {
        switchStaus(state) { 
            switch(state){
                case 1:
                    return 'BTC'
                    break;
                case 2:
                    return 'ETH'
                    break;
                case 3:
                    return 'OMNI'
                    break;
                case 4:
                    return 'MBT'
                    break;
                case 5:
                    return 'EOS'
                    break;
            }
        },
        gettransactionConfirmList () {
            moniApi.transactionConfirmList({
                txId: this.row.txId
            }, (res) => {
                this.data12 = res
            }, (msg) => {
                this.$Message.error({content: msg})
            })
        }
    }
};
</script>