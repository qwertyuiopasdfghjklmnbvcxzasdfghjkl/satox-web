<template>
    <Card style="width:1200px">
        <p slot="title">
            {{vm.$t('exchange.jyjl')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Tabs>
            <TabPane :label="vm.$t('exchange.dqwt')">
                <Table :columns="columns1" :data="data1"></Table>
                <Page :current="curPage" :total="total" @on-change="changePage"
                      style="text-align:center;margin-top:20px;"></Page>
            </TabPane>
            <TabPane :label="vm.$t('exchange.lswt')">
                <Table :columns="columns2" :data="data2"></Table>
                <Page :current="curPage1" :total="total1" @on-change="changePage1"
                      style="text-align:center;margin-top:20px;"></Page>
            </TabPane>
            <TabPane :label="vm.$t('exchange.bbjyjl')">
                <Table :columns="columns3" :data="data3"></Table>
                <Page :current="curPage2" :total="total2" @on-change="changePage2"
                      style="text-align:center;margin-top:20px;"></Page>
            </TabPane>
        </Tabs>
    </Card>
</template>

<script>
    import currenyApi from '../../../api/currency';

    export default {
        props: ['userId'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                curPage: 1,
                total: 0,
                curPage1: 1,
                total1: 0,
                curPage2: 1,
                total2: 0,
                columns1: [
                    {title: vm.$t('common.sj'), key: 'entrustmentTime'},
                    {title: vm.$t('exchange.sc'), key: 'market'},
                    {
                        title: vm.$t('exchange.fx'), key: 'direction',
                        render: (h, params) => {
                            return h('div', params.row.direction == 1 ? vm.$t('exchange.m1') : vm.$t('exchange.m4'));
                        }
                    },
                    {
                        title: vm.$t('exchange.jg'), key: 'price',
                        render: (h, params) => {
                            return h('div', params.row.price === -1 ? vm.$t('exchange.sj') : params.row.price);
                        }
                    },
                    {title: vm.$t('exchange.cjl'), key: 'exchangeQuantity'},
                    {title: vm.$t('exchange.zl'), key: 'total'},
                    {
                        title: vm.$t('common.je'), key: 'amount',
                        render: (h, params) => {
                            return h('div', params.row.price === -1 ? vm.$t('exchange.sj')
                                : (params.row.price * params.row.exchangeQuantity).toFixed(8));
                        }
                    }
                ],
                columns2: [
                    {title: vm.$t('exchange.wtsj'), key: 'entrustmentTime'},
                    {title: vm.$t('exchange.sc'), key: 'market'},
                    {
                        title: vm.$t('exchange.fx'), key: 'direction',
                        render: (h, params) => {
                            return h('div', params.row.direction == 1 ? vm.$t('exchange.m1') : vm.$t('exchange.m4'));
                        }
                    },
                    {
                        title: vm.$t('exchange.jg'), key: 'price',
                        render: (h, params) => {
                            return h('div', params.row.price === -1 ? vm.$t('exchange.sj') : params.row.price);
                        }
                    },
                    {title: vm.$t('exchange.cjjj'), key: 'averagePrice'},
                    {title: vm.$t('exchange.cjl'), key: 'exchangeQuantity'},
                    {title: vm.$t('exchange.zl'), key: 'total'},
                    {
                        title: vm.$t('exchange.cjje'), key: 'exchangeAmount',
                        render: (h, params) => {
                            return h('div', params.row.exchangeAmount === -1 ? vm.$t('exchange.sj')
                                : params.row.exchangeAmount);
                        }
                    },
                    {
                        title: vm.$t('common.zt'), key: 'state',// 1，正常 2，部分成交 0，已撤销 3，全部成交
                        render: (h, params) => {
                            return h('div', this.switchStaus(params.row.state));
                        }
                    }
                ],
                columns3: [
                    {title: vm.$t('common.sj'), key: 'exchangeTime'},
                    {title: vm.$t('exchange.sc'), key: 'market'},
                    {
                        title: vm.$t('exchange.fx'), key: 'direction',
                        render: (h, params) => {
                            return h('div', params.row.direction == 1 ? vm.$t('exchange.m1') : vm.$t('exchange.m4'));
                        }
                    },
                    {title: vm.$t('exchange.cjjj'), key: 'averagePrice'},
                    {title: vm.$t('exchange.cjl'), key: 'exchangeQuantity'},
                    {
                        title: vm.$t('exchange.cjje'), key: 'exchangeAmount',
                        render: (h, params) => {
                            return h('div', (params.row.exchangeAmount).toFixed(8));
                        }
                    },
                    {title: vm.$t('exchange.sxf'), key: 'fee'}
                ],
                data1: [],
                data2: [],
                data3: []
            };
        },
        created () {
            this.userCurreny();
            this.historyUserCurreny();
            this.tradeCurreny();
        },
        methods: {
            switchStaus (state) { // 1，正常 2，部分成交 0，已撤销 3，全部成交
                switch (state) {
                    case 0:
                        return this.vm.$t('exchange.ycx');
                        break;
                    case 1:
                        return this.vm.$t('exchange.zc');
                        break;
                    case 2:
                        return this.vm.$t('exchange.bfcj');
                        break;
                    case 3:
                        return this.vm.$t('exchange.qbcj');
                        break;
                    case 4:
                        return this.vm.$t('exchange.djyexhw');
                        break;
                }
            },
            closeDialog () {
                this.$emit('removeDialog');
            },
            userCurreny () {
                currenyApi.findUserCurrentEntrustmentList(this.curPage, this.userId, (res, total) => {
                    this.total = total;
                    this.data1 = res;
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            changePage (page) {
                this.curPage = page;
                this.userCurreny();
            },
            historyUserCurreny () {
                currenyApi.findUserHistoricalEntrustmentList(this.curPage1, this.userId, (res, total) => {
                    this.total1 = total;
                    this.data2 = res;
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            changePage1 (page) {
                this.curPage1 = page;
                this.historyUserCurreny();
            },
            tradeCurreny () {
                currenyApi.findUserExchangeRecordList(this.curPage2, this.userId, (res, total) => {
                    this.total2 = total;
                    this.data3 = res;
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            changePage2 (page) {
                this.curPage2 = page;
                this.tradeCurreny();
            }
        }
    };
</script>

<style>

</style>
