<!-- 交易市场管理 -->
<template>
    <div>
        <Tabs>
            <TabPane :label="$t('exchange.zsscgl')">
                <Card>
                    <p slot="title">{{$t('exchange.scjygl')}}
                        <span class="refresh" @click="reshAll"></span>
                    </p>
                    <Row>
                        <span>{{$t('exchange.scmc')}}</span>
                        <Input v-model="symbol" style="width: 300px"></Input>
                        <Button type="primary" @click="findMarket()">{{$t('common.cx')}}</Button>
                        <Button type="primary" @click="add_market()" style="float:right;">{{$t('exchange.xzzssc')}}</Button>
                    </Row>
                </Card>
                <Card style="margin-top:10px;">
                    <p slot="title">{{$t('exchange.zbzl')}}</p>
                    <Table :columns="columns2" :data="data2"></Table>
                    <Page :current="curPage" :total="total" @on-change="changePage"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
                <Card style="margin-top:10px;">
                    <p slot="title">{{$t('exchange.jysjtj')}}</p>
                    <Table :columns="columns1" :data="data1"></Table>
                    <Page :current="curPage1" :total="total1" @on-change="changePage1"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </TabPane>
            <TabPane :label="$t('exchange.xnscgl')">
                <Card>
                    <p slot="title">{{$t('exchange.xnscgl')}}
                        <span class="refresh" @click="reshAll"></span>
                    </p>
                    <Row>
                        <span>{{$t('exchange.scmc')}}</span>
                        <Input v-model="symbol" style="width: 300px"></Input>
                        <Button type="primary" @click="getMarketList1()">{{$t('common.cx')}}</Button>
                        <Button type="primary" @click="add_market1()" style="float:right;">{{$t('exchange.xzxnsc')}}</Button>
                    </Row>
                </Card>
                <Card style="margin-top:10px;">
                    <p slot="title">{{$t('exchange.zbzl')}}</p>
                    <Table :columns="columns3" :data="data3"></Table>
                    <Page :current="curPage3" :total="total3" @on-change="changePage3"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </TabPane>
            <TabPane :label="$t('exchange.dzsp')">
                <Card>
                    <p slot="title">{{$t('exchange.dzspscgl')}}
                        <span class="refresh" @click="reshAll"></span>
                    </p>
                    <Row>
                        <span>{{$t('exchange.scmc')}}</span>
                        <Input v-model="symbol" style="width: 300px"></Input>
                        <Button type="primary" @click="getMarketList2()">{{$t('common.cx')}}</Button>
                        <Button type="primary" @click="add_market2()" style="float:right;">{{$t('exchange.xzdzsp')}}</Button>
                    </Row>
                </Card>
                <Card style="margin-top:10px;">
                    <p slot="title">{{$t('exchange.zbzl')}}</p>
                    <Table :columns="columns3" :data="data4"></Table>
                    <Page :current="curPage4" :total="total4" @on-change="changePage4"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    import util from '../../libs/util';
    import add_market from './market/add_market';
    import market_setting from './market/market_setting';
    import currenyApi from '../../api/currency';

    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                curPage1: 1,
                total1: 0,
                curPage3: 1,
                total3: 0,
                curPage4: 1,
                total4: 0,
                symbol: '',
                columns1: [
                    {
                        title: this.$t('exchange.sc'),
                        key: 'market'
                    },
                    {
                        title: this.$t('common.zt'),
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
                            //   return h('div', params.row.state == 1 ? '上线' : '下线')
                        }
                    },
                    {
                        title: this.$t('exchange.zxjg'),
                        key: 'currentPrice'
                    },
                    {
                        title: this.$t('exchange.rcjl'),
                        key: 'exchangeQuantityDaily'
                    },
                    {
                        title: this.$t('exchange.rzgj'),
                        key: 'highestPriceDaily'
                    },
                    {
                        title: this.$t('exchange.rzdj'),
                        key: 'lowestPriceDaily'
                    },
                    {
                        title: this.$t('exchange.ryh'),
                        key: 'userCountDaily'
                    },
                    {
                        title: this.$t('exchange.rcjbs'),
                        key: 'exchangeCountDaily'
                    },
                    {
                        title: this.$t('exchange.ljyh'),
                        key: 'userTotalCount'
                    },
                    {
                        title: this.$t('exchange.ljjyl'),
                        key: 'totalExchangeQuantity'
                    },
                    {
                        title: this.$t('exchange.rjybl'),
                        key: 'ratioExchangeDaily'
                    }
                ],
                data1: [],
                columns2: [
                    {
                        title: this.$t('exchange.scmc'),
                        key: 'market'
                    },
                    {
                        title: this.$t('common.zt'),
                        key: 'state',
                        render: (h, params) => {
                            let status = params.row.state;
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
                                }, params.row.state == 1 ? this.$t('exchange.sx') : this.$t('exchange.xs')),
                            ]);
                            //   return h('div', params.row.state == 1 ? '上线' : '下线')
                        }
                    },
                    {
                        title: this.$t('exchange.jgjd'),
                        key: 'accuracy'
                    },
                    {
                        title: this.$t('exchange.sljd'),
                        key: 'quantityAccu'
                    },
                    {
                        title: this.$t('exchange.jejd'),
                        key: 'amountAccu'
                    },
                    {
                        title: this.$t('exchange.sdhbjd'),
                        key: 'digit'
                    },
                    {
                        title: this.$t('exchange.zxxdje'),
                        key: 'minPlaceOrderAmount2'
                    },
                    {
                        title: this.$t('exchange.zxjysl'),
                        key: 'minPlaceOrderQuantity2'
                    },
                    {
                        title: this.$t('exchange.gdjg'),
                        key: 'fixedPrice'
                    },
                    {
                        title: this.$t('exchange.zdwtbs'),
                        key: 'autoEntrustCount'
                    },
                    {
                        title: this.$t('common.cz'),
                        key: 'address',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {marginRight: '10px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(market_setting, {
                                                item: params.row,
                                                okCallback: () => {
                                                    this.getMarketList();
                                                }
                                            });
                                        }
                                    }
                                }, this.$t('exchange.scsz'))
                            ]);
                        }
                    }
                ],
                data2: [],

                columns3: [
                    {
                        title: this.$t('exchange.scmc'),
                        key: 'market'
                    },
                    {
                        title: this.$t('exchange.jgjd'),
                        key: 'accuracy'
                    },
                    {
                        title: this.$t('exchange.sdhbjd'),
                        key: 'digit'
                    },
                    {
                        title: this.$t('exchange.zxxdje'),
                        key: 'minPlaceOrderAmount2'
                    },
                    {
                        title: this.$t('exchange.zxjysl'),
                        key: 'minPlaceOrderQuantity2'
                    },
                    {
                        title: this.$t('common.cz'),
                        key: 'address',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {marginRight: '10px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(market_setting, {
                                                item: params.row,
                                                okCallback: () => {
                                                    this.getMarketList();
                                                }
                                            });
                                        }
                                    }
                                }, this.$t('exchange.scsz'))
                            ]);
                        }
                    }
                ],
                data3: [],
                data4: [],
            };
        },
        created () {
            this.findMarketList();
            this.getMarketList();
            this.getMarketList1();
            this.getMarketList2()
        },
        methods: {
            reshAll () {
                this.curPage = 1;
                this.curPage1 = 1;
                this.curPage4 = 1;
                this.curPage3 = 1;
                this.symbol = '';
                this.findMarketList();
                this.findMarketList();
                this.getMarketList1();
                this.getMarketList2();
            },
            findMarket () {
                currenyApi.findMarketExchangeInfoList(this.curPage1, {
                    market: this.symbol
                }, (res, total) => {
                    this.total1 = total;
                    this.data1 = res;
                }, (msg) => {
                    this.$Messags.error({content: msg});
                });
                currenyApi.findMarketList({
                    market: this.symbol
                }, this.curPage, (res, total) => {
                    this.total = total;
                    this.data2 = res;
                }, (msg) => {
                    this.$Messags.error({content: msg});
                });
            },
            add_market () {
                util.setDialog(add_market, {
                    type: 1,
                    okCallback: () => {
                        this.getMarketList();
                    }
                });
            },
            add_market1 () {
                util.setDialog(add_market, {
                    type: 0,
                    okCallback: () => {
                        this.getMarketList1();
                    }
                });
            },
            add_market2 () {
                util.setDialog(add_market, {
                    type: 2,
                    okCallback: () => {
                        this.getMarketList2();
                    }
                });
            },
            findMarketList () { // 市场交易信息
                currenyApi.findMarketExchangeInfoList(this.curPage1, {
                    market: this.symbol || null,
                    marketType: 1
                }, (res, total) => {
                    this.total1 = total;
                    this.data1 = res;
                });
            },
            getMarketList1 () { // 查询市场
                currenyApi.findMarketList({
                    market: this.symbol || null,
                    marketType: 0
                }, this.curPage3, (res, total) => {
                    this.total3 = total;
                    this.data3 = res;
                }, (msg) => {
                    this.$Messags.error({content: msg});
                });
            },
            getMarketList2 () { // 大宗商品查询市场
                currenyApi.findMarketList({
                    market: this.symbol || null,
                    marketType: 2
                }, this.curPage3, (res, total) => {
                    this.total4 = total;
                    this.data4 = res;
                }, (msg) => {
                    this.$Messags.error({content: msg});
                });
            },
            getMarketList () { // 查询市场
                currenyApi.findMarketList({marketType: 1}, this.curPage, (res, total) => {
                    this.total = total;
                    this.data2 = res;
                }, (msg) => {
                    this.$Messags.error({content: msg});
                });
            },
            changePage (page) {
                this.curPage = page;
                this.getMarketList();
            },
            changePage1 (page) {
                this.curPage1 = page;
                this.findMarketList();
            },
            changePage3 (page) {
                this.curPage3 = page;
                this.getMarketList1();
            },
            changePage4 (page) {
                this.curPage4 = page;
                this.getMarketList2();
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
