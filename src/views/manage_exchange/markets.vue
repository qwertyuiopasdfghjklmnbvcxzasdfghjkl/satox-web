<!-- 交易市场管理 -->
<template>
    <div>
        <Tabs>
            <TabPane label="真实市场管理">
                <Card>
                    <p slot="title">交易市场管理
                        <span class="refresh" @click="reshAll"></span>
                    </p>
                    <Row>
                        <span>市场名称</span>
                        <Input v-model="symbol" style="width: 300px"></Input>
                        <Button type="primary" @click="findMarket()">查询</Button>
                        <Button type="primary" @click="add_market()" style="float:right;">新增真实市场</Button>
                    </Row>
                </Card>
                <Card style="margin-top:10px;">
                    <p slot="title">资本资料</p>
                    <Table :columns="columns2" :data="data2"></Table>
                    <Page :current="curPage" :total="total" @on-change="changePage"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
                <Card style="margin-top:10px;">
                    <p slot="title">交易数据统计</p>
                    <Table :columns="columns1" :data="data1"></Table>
                    <Page :current="curPage1" :total="total1" @on-change="changePage1"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </TabPane>
            <TabPane label="虚拟市场管理">
                <Card>
                    <p slot="title">虚拟市场管理
                        <span class="refresh" @click="reshAll"></span>
                    </p>
                    <Row>
                        <span>市场名称</span>
                        <Input v-model="symbol" style="width: 300px"></Input>
                        <Button type="primary" @click="getMarketList1()">查询</Button>
                        <Button type="primary" @click="add_market1()" style="float:right;">新增虚拟市场</Button>
                    </Row>
                </Card>
                <Card style="margin-top:10px;">
                    <p slot="title">资本资料</p>
                    <Table :columns="columns3" :data="data3"></Table>
                    <Page :current="curPage3" :total="total3" @on-change="changePage3"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    import util from '../../libs/util';
    import add_market from './add_market';
    import market_setting from './market_setting';
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
                symbol: '',
                columns1: [
                    {
                        title: '市场',
                        key: 'market'
                    },
                    {
                        title: '状态',
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
                                }, params.row.status == 1 ? '上线' : '下线'),
                            ]);
                            //   return h('div', params.row.state == 1 ? '上线' : '下线')
                        }
                    },
                    {
                        title: '最新价格',
                        key: 'currentPrice'
                    },
                    {
                        title: '日成交量',
                        key: 'exchangeQuantityDaily'
                    },
                    {
                        title: '日最高价',
                        key: 'highestPriceDaily'
                    },
                    {
                        title: '日最低价',
                        key: 'lowestPriceDaily'
                    },
                    {
                        title: '日用户',
                        key: 'userCountDaily'
                    },
                    {
                        title: '日成交笔数',
                        key: 'exchangeCountDaily'
                    },
                    {
                        title: '累计用户',
                        key: 'userTotalCount'
                    },
                    {
                        title: '累计交易量',
                        key: 'totalExchangeQuantity'
                    },
                    {
                        title: '日交易比例',
                        key: 'ratioExchangeDaily'
                    }
                ],
                data1: [],
                columns2: [
                    {
                        title: '市场名称',
                        key: 'market'
                    },
                    {
                        title: '状态',
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
                                }, params.row.state == 1 ? '上线' : '下线'),
                            ]);
                            //   return h('div', params.row.state == 1 ? '上线' : '下线')
                        }
                    },
                    {
                        title: '价格精度',
                        key: 'accuracy'
                    },
                    {
                        title: '数量精度',
                        key: 'quantityAccu'
                    },
                    {
                        title: '金额精度',
                        key: 'amountAccu'
                    },
                    {
                        title: '深度合并精度',
                        key: 'digit'
                    },
                    {
                        title: '最小下单金额',
                        key: 'minPlaceOrderAmount2'
                    },
                    {
                        title: '最小交易数量',
                        key: 'minPlaceOrderQuantity2'
                    },
                    {
                        title: '固定价格',
                        key: 'fixedPrice'
                    },
                    {
                        title: '自动委托笔数',
                        key: 'autoEntrustCount'
                    },
                    {
                        title: '操作',
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
                                }, '市场设置')
                            ]);
                        }
                    }
                ],
                data2: [],

                columns3: [
                    {
                        title: '市场名称',
                        key: 'market'
                    },
                    {
                        title: '价格精度',
                        key: 'accuracy'
                    },
                    {
                        title: '深度合并精度',
                        key: 'digit'
                    },
                    {
                        title: '最小下单金额',
                        key: 'minPlaceOrderAmount2'
                    },
                    {
                        title: '最小交易数量',
                        key: 'minPlaceOrderQuantity2'
                    },
                    {
                        title: '操作',
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
                                }, '市场设置')
                            ]);
                        }
                    }
                ],
                data3: []
            };
        },
        created () {
            this.findMarketList();
            this.getMarketList();
            this.getMarketList1();
        },
        methods: {
            reshAll () {
                this.findMarketList();
                this.getMarketList();
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
