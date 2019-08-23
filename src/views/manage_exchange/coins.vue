<!-- 币种管理 -->
<template>
    <Row>
        <Card>
            <p slot="title">{{$t('exchange.bzgl')}}
                <span class="refresh" @click="reshAll"></span>
            </p>
            <Row>
                <span>{{$t('exchange.dh')}}</span>
                <Input v-model="symbol"  style="width: 300px"></Input>
                <Button type="primary" @click="findSymbolList()">{{$t('common.cx')}}</Button>
                <Button type="primary" @click="add_order()" style="float:right;">{{$t('common.tj')}}</Button>
            </Row>
        </Card>
        <Card style="margin-top:20px;">
            <p slot="title">{{$t('exchange.jbzl')}}</p>
            <Table ref="test" :columns="columns1" :data="data1" @on-sort-change="custom"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
        <Card style="margin-top:20px;">
            <p slot="title">{{$t('exchange.jbqk')}}</p>
            <Table ref="test1" :columns="columns2" :data="data2" @on-sort-change="custom1"></Table>
            <Page :current="curPage1" :total="total1" @on-change="changePage1"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </Row>
</template>

<script>
    import util from '../../libs/util';
    import add_order from './coin/add_order';
    import coin_setting from './coin/coin_setting';
    import currenyApi from '../../api/currency';
    import updata from './users/updata';

    export default {
        data () {
            return {
                flag: 1,
                flag1: 1,
                curPage: 1,
                total: 0,
                curPage1: 1,
                total1: 0,
                symbol: '',
                columns1: [
                    {
                        title: this.$t('exchange.dh'),
                        key: 'symbol', sortable: 'custom', sortType: 'asc'
                    },
                    {
                        title: this.$t('exchange.zwm'),
                        key: 'captionCN'
                    },
                    {
                        title: this.$t('common.zllx'),
                        key: 'symbolType',
                        render: (h, params) => {
                            return h('div', this.switchStaus(params.row.symbolType));
                        }
                    },
                    {
                        title: this.$t('exchange.sc'),
                        key: 'market'
                    },
                    {
                        title: this.$t('exchange.erchydz'),
                        key: 'contractAddr'
                    },
                    {
                        title: this.$t('exchange.hyjd'),
                        key: 'contractDecimals'
                    },
                    {
                        title: this.$t('exchange.czqx'),
                        key: 'rechargeFlag', //1 正常 2  暂停
                        render: (h, params) => {
                            let status = params.row.rechargeFlag;
                            let color = '';
                            switch (status) {
                                case 1:
                                    color = 'green';
                                    break;
                                case 2:
                                    color = '#ff8041';
                                    break;
                            }
                            return h('div', [
                                h('div', {
                                    style: {color: color}
                                }, params.row.rechargeFlag == 1 ? this.$t('exchange.zc') : this.$t('exchange.zt')),
                            ]);
                        }
                    },
                    {
                        title: this.$t('exchange.tbqx'), //1 正常 2  暂停
                        key: 'withdrawFlag',
                        render: (h, params) => {
                            let status = params.row.withdrawFlag;
                            let color = '';
                            switch (status) {
                                case 1:
                                    color = 'green';
                                    break;
                                case 2:
                                    color = '#ff8041';
                                    break;
                            }
                            return h('div', [
                                h('div', {
                                    style: {color: color}
                                }, params.row.withdrawFlag == 1 ? this.$t('exchange.zc') : this.$t('exchange.zt')),
                            ]);
                        }
                    },
                    {
                        title: 'GASPrice',
                        key: 'gasprice',
                        render: (h, params) => {
                            return h('div', params.row.gasprice);
                        }
                    },
                    {
                        title: 'GASNumber',
                        key: 'gaslimit',
                        render: (h, params) => {
                            return h('div', params.row.gaslimit);
                        }
                    },
                    {
                        title: this.$t('exchange.zxtbsl'),
                        key: 'minWithdrawQuantity',
                        render: (h, params) => {
                            return h('div', params.row.minWithdrawQuantity);
                        }
                    },
                    {
                        title: this.$t('exchange.sxfgded'),
                        key: 'feeFixedAmount',
                        render: (h, params) => {
                            return h('div', params.row.feeFixedAmount);
                        }
                    },
                    {
                        title: this.$t('exchange.kgf'),
                        key: 'minerFee',
                        render: (h, params) => {
                            return h('div', params.row.minerFee);
                        }
                    },
                    {
                        title: this.$t('common.zt'), //1 上线 2  下线
                        key: 'status',
                        render: (h, params) => {
                            let status = params.row.status;
                            let color = '';
                            switch (status) {
                                case 1:
                                    color = 'green';
                                    break;
                                case 2:
                                    color = '#ff8041';
                                    break;
                            }
                            return h('div', [
                                h('div', {
                                    style: {color: color}
                                }, params.row.status == 1 ? this.$t('exchange.sx') : this.$t('exchange.xs')),
                            ]);
                        }
                    },
                    {
                        title: this.$t('exchange.ddqks'),
                        key: 'confirmBlock',
                        render: (h, params) => {
                            return h('div', params.row.confirmBlock);
                        }
                    },
                    {
                        title: this.$t('common.cz'),
                        key: 'opreat',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {marginRight: '3px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(coin_setting, {
                                                item: params.row,
                                                okCallback: () => {
                                                    this.findSymbolList();
                                                }
                                            });
                                        }
                                    }
                                }, this.$t('exchange.czsz')),
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {marginRight: '3px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(updata, {
                                                item: params.row,
                                                okCallback: () => {
                                                    this.reshAll();
                                                }
                                            });
                                        }
                                    }
                                }, this.$t('common.xg')),
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {marginRight: '3px'},
                                    on: {
                                        click: () => {
                                            currenyApi.updateSymbol({
                                                status: params.row.status === 1 ? 2 : 1,
                                                symbolId: params.row.symbolId,
                                                version: params.row.version
                                            }, (res) => {
                                                this.$Message.success({content: this.$t('common.xgcg')});
                                                this.findSymbolList();
                                            }, (msg) => {
                                                this.$Message.success({content: msg});
                                            });
                                        }
                                    }
                                }, params.row.status === 1 ? this.$t('exchange.xs') : this.$t('exchange.sx'))
                            ]);
                        }
                    }
                ],
                data1: [],
                columns2: [
                    {
                        title: this.$t('exchange.dh'),
                        key: 'symbol', sortable: 'custom', sortType: 'asc'
                    },
                    {
                        title: this.$t('exchange.yhsl'),
                        key: 'userCount'
                    },
                    {
                        title: this.$t('exchange.zxjg'),
                        key: 'currentPrice'
                    },
                    {
                        title: this.$t('exchange.rjyl'),
                        key: 'exchangeDailyQuantity'
                    },
                    {
                        title: this.$t('exchange.syrspsl'),
                        key: 'closingCapitalPoolYesterdayQuantity'
                    },
                    {
                        title: this.$t('finance.dqsl'),
                        key: 'currentCapitalPoolQuantity'
                    },
                    {
                        title: this.$t('finance.rjz'),
                        key: 'netIncreaseDailyQuantity'
                    },
                    {
                        title: this.$t('exchange.rhsl'),
                        key: 'turnoverRateDaily'
                    }
                ],
                data2: []
            };
        },
        computed: {},
        created () {
            this.getchangeList();
            this.findSymbolList();
            this.symbolTypeList = JSON.parse(window.localStorage.symbolTypes);
        },
        methods: {
            reshAll () {
                this.getchangeList();
                this.findSymbolList();
            },
            switchStaus (state) {
                return this.symbolTypeList.map((res) => {
                    if (res.code == state) {
                        return res.name;
                    }
                });
            },
            add_order () {
                util.setDialog(add_order, {
                    okCallback: () => {
                        this.findSymbolList();
                    }
                });
            },
            getchangeList () {
                currenyApi.findSymbolExchangeInfoList({
                    symbol: this.symbol || null
                }, this.curPage1, this.flag1, (res, total1) => {
                    this.total1 = total1;
                    this.data2 = res;
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            custom1 (o) {
                this.curPage1 = 1;
                if (o.order === 'desc') {
                    this.flag1 = 0;
                    this.getchangeList();
                } else {
                    this.$refs.test1.cloneColumns[0]._sortType = 'asc';
                    this.flag1 = 1;
                    this.getchangeList();
                }
            },
            custom (o) {
                this.curPage = 1;
                if (o.order === 'desc') {
                    this.flag = 0;
                    this.findSymbolList();
                } else {
                    this.$refs.test.cloneColumns[0]._sortType = 'asc';
                    this.flag = 1;
                    this.findSymbolList();
                }
            },
            findSymbolList () {
                currenyApi.findSymbolList({
                    symbol: this.symbol || null
                }, this.curPage, this.flag, (res, total) => {
                    this.total = total;
                    this.data1 = res;
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            changePage (page) {
                this.curPage = page;
                this.findSymbolList();
            },
            changePage1 (page1) {
                this.curPage1 = page1;
                this.getchangeList();
            }
        }
    };
</script>

<style lang="less" scoped>
    .ivu-card-head-inner, .ivu-card-head p {
        display: flex !important;
        justify-content: space-between !important;
        height: 40px !important;
        line-height: 40px !important;
    }

    .refresh {
        width: 49px;
        height: 24px;
        background: url(../../images/frsh.png) center/cover no-repeat;
        background-size: contain;
        cursor: pointer;
        color: #2d8cf0;
    }
</style>
