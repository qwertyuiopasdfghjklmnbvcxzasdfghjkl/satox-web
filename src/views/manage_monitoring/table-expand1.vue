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
                    title: this.$t('common.jyid'),
                    key: 'txId'
                },
                {
                    title: this.$t('common.yhm'),
                    key: 'userName'
                },
                {
                    title: this.$t('monitoring.zhid'),
                    key: 'userId'
                },
                {
                    title: this.$t('common.bz'),
                    key: 'symbol'
                },
                {
                    title: this.$t('monitoring.gllx'),
                    key: 'symbolType',
                    render: (h, params) => {
                        return h('div', this.switchStaus(params.row.symbolType))
                    }
                },
                {
                    title: this.$t('monitoring.fdz'),
                    key: 'fromAddress'
                },
                {
                    title: this.$t('monitoring.tdz'),
                    key: 'toAddress'
                },
                {
                    title: this.$t('monitoring.txed'),
                    key: 'amount'
                },
                {
                    title: this.$t('exchange.sxf'),
                    key: 'procedureFee'
                },
                {
                    title: this.$t('exchange.kgf'),
                    key: 'minerFee'
                },
                {
                    title: this.$t('monitoring.qkqrs'),
                    key: 'confirmation'
                },
                {
                    title: this.$t('monitoring.qkh'),
                    key: 'blockNumber'
                },
                {
                    title: this.$t('common.zt'),  //1等待 2 完成
                    key: 'status',
                    render: (h, params) => {
                        return h('div', params.row.status === 1 ? this.$t('common.dd'): this.$t('common.wc'))
                    }
                },
                {
                    title: this.$t('monitoring.sfyjz'),//1未记账 1已记账
                    key: 'ledgeredFlag',
                    render: (h, params) => {
                        return h('div', params.row.ledgeredFlag === 1 ? this.$t('monitoring.wjz'): this.$t('monitoring.yjz'))
                    }
                },
                {
                    title: this.$t('common.cjsj'),
                    key: 'createdTime'
                },
            ],
            data12: [],
            symbolTypeList: [],
        }
    },
    created () {
        this.gettransactionConfirmList()
        this.symbolTypeList = JSON.parse(window.localStorage.symbolTypes);
    },
    methods: {
        switchStaus(state) {
            return this.symbolTypeList.map((res) => {
                if (res.code == state) {
                    return res.name;
                }
            });
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
