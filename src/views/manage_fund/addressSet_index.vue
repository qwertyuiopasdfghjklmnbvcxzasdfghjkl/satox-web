<template>
    <div class="addressSet">
        <Card>
            <p slot="title">自动转账
                <Button @click="adddEploy">添加配置</Button>
            </p>
            <Table :columns="columns1" :data="data1"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>  
        </Card>
         <Card>
            <p slot="title">手动转账</p>
             <Table :columns="columns2" :data="data2"></Table>
            <Page :current="curPage1" :total="total1" @on-change="changePage1" style="text-align:center;margin-top:20px;"></Page>               
        </Card>
    </div>
</template>
<script>
import upAddress from './upAddress'
import util from '../../libs/util'
import fundApi from '../../api/fund'
import eploy from './eploy'
export default {
    data () {
        return {
            curPage: 1,
            total: 0,
            curPage1: 1,
            total1: 0,
            columns1: [
                {
                    title: '币种',
                    key: 'symbol'
                },
                {
                    title: '最小金额',
                    key: 'coinMin'
                },
                {
                    title: '保留金额',
                    key: 'coinReserve'
                },
                {
                    title: 'BTC矿工费',
                    key: 'minerFee'
                },
                {
                    title: 'ETH GAS单价',
                    key: 'gasPrice'
                },
                {
                    title: 'ETH GAS上限',
                    key: 'gasLimit'
                },
                {
                    title: '是否可用',
                    key: 'enable',
                    render: (h, params) => {
                        return h('div', params.row.enable === 0 ? '不可用' : '可用')
                    }
                },
                {
                    title: ' ',
                    key: 'address',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {type: 'primary', size: 'small'},
                                style: {marginRight: '10px'},
                                on: {
                                    click: () => {
                                        util.setDialog(upAddress, {
                                            item: params.row,
                                            okCallback: () => {
                                                this.getTransferConfig()
                                            }
                                        })
                                    }
                                }
                            }, '修改')
                        ]);
                    }
                }
            ],
            data1: [],
            columns2: [
                {
                    title: '币种',
                    key: 'symbol'
                },
                {
                    title: '账户',
                    key: 'username'
                },
                {
                    title: '地址',
                    key: 'address'
                },
                {
                    title: ' ',
                    key: 'address',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {type: 'primary', size: 'small'},
                                style: {marginRight: '10px'},
                                on: {
                                    click: () => {
                                        // util.setDialog(upAddress)
                                        fundApi.transfer ({
                                            param: '2000',
                                            transferTye: 1,
                                            symbol: params.row.symbol
                                        },(res) => {
                                            this.$Message.success({content: '操作成功'})
                                        }, (msg) => {
                                            this.$Message.error({content: msg})                                            
                                        })
                                    }
                                }
                            }, '转账')
                        ]);
                    }
                }
            ],
            data2: []
        }
    },
    created () {
        this.getTransferConfig()
        this.getAdminCoinPool()
    },
    methods: {
        adddEploy () {
            util.setDialog(eploy)
        },
        getTransferConfig () {
            fundApi.findTransferConfig(this.curPage, (res, total) => {
                this.total = total
                this.data1 = res
            })
        },
        changePage (page) {
            this.curPage = page,
            this.getTransferConfig()
        },
        getAdminCoinPool () {
            fundApi.getAdminCoinPool(this.curPage1, (res, total) => {
                this.total1= total
                this.data2 = res.data
            })
        },
        changePage1 (page) {
            this.curPage = page,
            this.getAdminCoinPool()
        },
    }
}
</script>
<style scoped>
.ivu-card-head p{display: flex;justify-content:space-between;height: 30px;}
</style>