<template>
    <div class="addressSet">
        <Card>
            <p slot="title">自动转账
                <Button @click="adddEploy">添加配置</Button>
            </p>
            <Table :columns="columns" :data="data"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage1"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
        <!--<Card>-->
        <!--<p slot="title">手动转账</p>-->
        <!--<Table :columns="columns2" :data="data2"></Table>-->
        <!--<Page :current="curPage1" :total="total1" @on-change="changePage1" style="text-align:center;margin-top:20px;"></Page>-->
        <!--</Card>-->
        <!-- -->
    </div>
</template>
<script>
    import upAddress from './upAddress';
    import util from '../../libs/util';
    import fundApi from '../../api/fund';
    import eploy from './eploy';
    import monitorApi from '../../api/monitoring';

    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                curPage1: 1,
                total1: 0,
                symbolType: '',
                symbol: '',
                initiationTime: '',
                direction: '',
                username: '',
                txId: '',
                status: '',
                size: 10,
                columns: [
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
                        title: '矿工费币种',
                        key: 'minerSymbol'
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
                            return h('div', params.row.enable === 0 ? '不可用' : '可用');
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
                                                    this.getTransferConfig();
                                                }
                                            });
                                        }
                                    }
                                }, '修改')
                            ]);
                        }
                    }
                ],
                data: [],
                columns1: [
                    {
                        title: '转账类型',
                        key: 'direction',
                        render: (h, params) => {
                            return h('div', this.switchDirection(params.row.direction));
                        }
                    },
                    {
                        title: '交易ID',
                        key: 'txId'
                    },
                    {
                        title: '用户名',
                        key: 'username'
                    },
                    {
                        title: '币种',
                        key: 'symbol'
                    },
                    {
                        title: '公链类型',
                        key: 'symbolType',
                        render: (h, params) => {
                            return h('div', this.switchStaus(params.row.symbolType));
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
                        title: '数量',
                        key: 'amount'
                    },
                    {
                        title: '矿工费',
                        key: 'btcMinerFee'
                    },
                    {
                        title: '转账状态', //1 等待  2 完成
                        key: 'status',
                        render: (h, params) => {
                            return h('div', this.switchStaus2(params.row.status));
                        }
                    },
                    {
                        title: '交易失败原因',
                        key: 'failMsg'
                    },
                    {
                        title: 'Nounce值',
                        key: 'nonce'
                    },
                    {
                        title: '交易发起时间',
                        key: 'createAt'
                    },
                    {
                        title: '交易完成时间',
                        key: 'completeTime'
                    }
                ],
                data1: []
            };
        },
        created () {
            this.getTransferConfig();
            this.getconfirmList();
        },
        methods: {
            adddEploy () {
                util.setDialog(eploy, {
                    okCallback: () => {
                        this.getTransferConfig();
                    }
                });
            },
            getTransferConfig () {
                fundApi.findTransferConfig(this.curPage, (res, total) => {
                    this.total = total;
                    this.data = res;
                });
            },
            changePage1 (page) {
                this.curPage = page;
                this.getTransferConfig();
            },
            switchStaus (state) {
                switch (state) { // 1 BTC 2 ETH 3 OMNI 4 MBT 5 EOS
                    case 1:
                        return 'BTC';
                        break;
                    case 2:
                        return 'ETH';
                        break;
                    case 3:
                        return 'OMNI';
                        break;
                    case 4:
                        return 'MBT';
                        break;
                    case 5:
                        return 'EOS';
                        break;
                }
            },
            switchDirection (state) {
                switch (state) { // 1：充值 ，2：提现，3：交易所归集，4：冷钱包充值，5：冷钱包提现
                    case 1:
                        return '充值';
                        break;
                    case 2:
                        return '提现';
                        break;
                    case 3:
                        return '交易所归集';
                        break;
                    case 4:
                        return '冷钱包充值';
                        break;
                    case 5:
                        return '冷钱包提现';
                        break;
                }
            },
            switchStaus2 (state) {
                switch (state) { //  状态 1 未处理 2 等待交易发起 3 交易已发送(等待对账) 4 撤销 5 提现失败 6对账完成 7提现失败资金返还 ,
                    case 1:
                        return '未处理';
                        break;
                    case 2:
                        return '等待交易发起';
                        break;
                    case 3:
                        return '交易已发送';
                        break;
                    case 4:
                        return '撤销';
                        break;
                    case 5:
                        return '提现失败';
                        break;
                    case 6:
                        return '对账完成';
                        break;
                    case 7:
                        return '提现失败资金返还';
                        break;
                }
            },
            getconfirmList () {
                monitorApi.transfersColdList({
                    page: this.curPage,
                    size: this.size,
                    symbolType: this.symbolType,
                    initiationTime: this.initiationTime,
                    username: this.username,
                    status: this.status,
                    direction: this.direction,
                    symbol: this.symbol,
                    txId: this.txId
                }, (res, total) => {
                    this.total = total;
                    this.data1 = res;
                });
            },
            changePage (page) {
                this.curPage = page;
                this.getconfirmList();
            }
        }
    };
</script>
<style scoped>
    .ivu-card-head p {
        display: flex;
        justify-content: space-between;
        height: 30px;
    }
</style>
